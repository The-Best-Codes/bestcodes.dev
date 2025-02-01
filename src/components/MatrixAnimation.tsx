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
  const speed = props.speed || 1;

  let canvasRef: HTMLCanvasElement | undefined;
  const [drops, setDrops] = createSignal<number[]>([]);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const initCanvas = (preserveDrops = false) => {
    if (!canvasRef) return;

    const oldDrops = drops();
    const oldColumns = oldDrops.length;

    canvasRef.width = window.innerWidth;
    canvasRef.height = canvasRef.clientHeight; // Use the client height

    const newColumns = Math.floor(canvasRef.width / fontSize);
    const canvasHeight = canvasRef.height;

    if (!preserveDrops) {
      // Initial setup: create random starting positions
      const initialDrops = Array(newColumns)
        .fill(0)
        .map(
          () => -Math.floor((Math.random() * canvasHeight) / fontSize) - 10, // Start above the canvas at random heights
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
            return -Math.floor((Math.random() * canvasHeight) / fontSize) - 10;
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
      const y = currentDrops[i] * fontSize;
      if (y >= 0) {
        // Only draw if the drop is on the canvas
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        ctx.fillText(text, x, y);
      }
      // Reset drop.
      if (y > canvasHeight && Math.random() > 0.975) {
        currentDrops[i] = -Math.floor(
          (Math.random() * canvasHeight) / fontSize,
        );
      } else {
        currentDrops[i] = currentDrops[i] + speed; // This is where we apply speed!
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
