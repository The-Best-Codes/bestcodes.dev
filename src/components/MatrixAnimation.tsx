import { createSignal, onCleanup, onMount } from "solid-js";

type MatrixAnimationProps = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  characters?: string;
  speed?: number;
};

const MatrixAnimation = (props: MatrixAnimationProps) => {
  const backgroundColor = props.backgroundColor || "#000";
  const textColor = props.textColor || "#0F0";
  const fontSize = props.fontSize || 16;
  const characters = props.characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let canvasRef: HTMLCanvasElement | undefined;
  const [drops, setDrops] = createSignal<number[]>([]);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const initCanvas = (preserveDrops = false) => {
    if (!canvasRef) return;

    const oldDrops = drops();
    const oldColumns = oldDrops.length;

    canvasRef.width = window.innerWidth;
    canvasRef.height = window.innerHeight;

    const newColumns = Math.floor(canvasRef.width / fontSize);

    if (!preserveDrops) {
      // Initial setup: create random starting positions
      const initialDrops = Array(newColumns)
        .fill(0)
        .map(
          () => -Math.floor(Math.random() * 50), // Start above the canvas at random heights
        );
      setDrops(initialDrops);
    } else {
      // Resize: preserve existing drops where possible
      const newDrops = Array(newColumns)
        .fill(0)
        .map((_, i) => {
          if (i < oldColumns) {
            // Preserve existing drop positions for columns that still exist
            return oldDrops[i];
          } else {
            // For new columns, start from random positions above the canvas
            return -Math.floor(Math.random() * 50);
          }
        });
      setDrops(newDrops);
    }
  };

  const draw = () => {
    if (!canvasRef || !isAnimating()) return;

    const ctx = canvasRef.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px monospace`;

    const currentDrops = [...drops()];

    for (let i = 0; i < currentDrops.length; i++) {
      // Only draw if the drop is actually on the canvas
      if (currentDrops[i] * fontSize >= 0) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = currentDrops[i] * fontSize;

        ctx.fillText(text, x, y);
      }

      // Update drop position
      if (
        currentDrops[i] * fontSize > canvasRef.height &&
        Math.random() > 0.975
      ) {
        currentDrops[i] = 0;
      } else {
        currentDrops[i]++;
      }
    }

    setDrops(currentDrops);
    requestAnimationFrame(draw);
  };

  onMount(() => {
    initCanvas(false); // Initial setup without preserving drops

    const handleResize = () => {
      initCanvas(true); // Resize while preserving existing drops
    };

    window.addEventListener("resize", handleResize);
    setIsAnimating(true);
    requestAnimationFrame(draw);

    onCleanup(() => {
      setIsAnimating(false);
      window.removeEventListener("resize", handleResize);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        "background-color": backgroundColor,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default MatrixAnimation;
