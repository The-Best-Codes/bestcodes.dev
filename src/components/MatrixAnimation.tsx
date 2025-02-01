import { createSignal, onCleanup, onMount } from "solid-js";

type MatrixAnimationProps = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  characters?: string;
  delay?: number;
};

const MatrixAnimation = (props: MatrixAnimationProps) => {
  const backgroundColor = props.backgroundColor || "#000";
  const textColor = props.textColor || "#0F0";
  const fontSize = props.fontSize || 16;
  const characters = props.characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const delay = props.delay || 60;

  let canvasRef: HTMLCanvasElement | undefined;
  const [drops, setDrops] = createSignal<number[]>([]);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [columns, setColumns] = createSignal(0);

  const initCanvas = (preserveDrops = false) => {
    if (!canvasRef) return;

    const oldDrops = drops();
    const oldColumns = columns();

    canvasRef.width = window.innerWidth;
    canvasRef.height = canvasRef.clientHeight; // Use the client height

    const newColumns = Math.floor(canvasRef.width / fontSize);

    setColumns(newColumns);

    const canvasHeight = canvasRef.height;

    if (!preserveDrops) {
      // Initial setup: create random starting positions
      const initialDrops = Array(newColumns)
        .fill(0)
        .map(() => Math.random() * canvasHeight);
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
            // For new columns, start from random positions
            return Math.random() * canvasHeight;
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
    const canvasHeight = canvasRef.height;

    for (let i = 0; i < currentDrops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      const x = i * fontSize;
      ctx.fillText(text, x, currentDrops[i]);

      currentDrops[i] += fontSize;
      if (currentDrops[i] > canvasHeight && Math.random() > 0.975) {
        currentDrops[i] = 0;
      } else if (currentDrops[i] > canvasHeight) {
        currentDrops[i] = currentDrops[i] - canvasHeight;
      }
    }
    setDrops(currentDrops);

    requestAnimationFrame(() => {
      setTimeout(draw, delay);
    });
  };

  onMount(() => {
    initCanvas(false); // Initial setup without preserving drops

    const handleResize = () => {
      initCanvas(true); // Resize while preserving existing drops
    };

    window.addEventListener("resize", handleResize);
    setIsAnimating(true);
    draw();

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
