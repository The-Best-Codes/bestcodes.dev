"use client";
import { useEffect, useRef, useState } from "react";

type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;

interface ReactMatrixAnimationProps {
  backgroundColor?: RGBAColor;
  textColor?: RGBAColor;
  frameRate?: number;
}

export const ReactMatrixAnimation = ({
  backgroundColor = "rgba(0, 0, 0, 0.05)",
  textColor = "rgba(0, 255, 0, 1)",
  frameRate = 20,
}: ReactMatrixAnimationProps) => {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const columnsRef = useRef(0);
  const dropsRef = useRef<number[]>([]);

  // Calculate frame delay in ms from desired frameRate
  const frameDelay = 1000 / frameRate;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;

    const recalculateColumns = () => {
      columnsRef.current = Math.floor(canvas.width / fontSize);
      dropsRef.current = new Array(columnsRef.current)
        .fill(0)
        .map(() => Math.random() * canvas.height);
    };

    const draw = (timestamp: number) => {
      // Only render if enough time has passed for desired frame rate
      if (timestamp - lastFrameTimeRef.current < frameDelay) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      // Create trail effect by using semi-transparent background
      // For full clear, use: ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = textColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, dropsRef.current[i]);

        dropsRef.current[i] += fontSize;

        if (dropsRef.current[i] > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        } else if (dropsRef.current[i] > canvas.height) {
          dropsRef.current[i] = dropsRef.current[i] - canvas.height;
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resizeCanvas();
      recalculateColumns();
    };

    // Initial setup
    resizeCanvas();
    recalculateColumns();
    animationFrameRef.current = requestAnimationFrame(draw);

    // Add resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    setLoading(false);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [backgroundColor, frameDelay, textColor]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        className={loading ? "animate-pulse w-full h-full" : "w-full h-full"}
        ref={canvasRef}
        style={{ background: backgroundColor }}
      />
    </div>
  );
};
