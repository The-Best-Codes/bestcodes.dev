export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  baseOpacity: number;
  opacitySpeed: number;
  opacityPhase: number;
  sizeSpeed: number;
  sizePhase: number;
}

const PARTICLE_COUNT = 355;
const BUBBLE_DISTANCE = 83.9;
const BUBBLE_PUSH = 0.35;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export function initParticles(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let particles: Particle[] = [];
  let raf = 0;
  const mouse = { x: -99999, y: -99999 };

  const createParticle = (x?: number, y?: number): Particle => ({
    x: x ?? rand(0, width),
    y: y ?? rand(0, height),
    vx: rand(-0.12, 0.12),
    vy: rand(-0.12, 0.12),
    size: rand(0.6, 2.2),
    baseSize: rand(0.6, 2.2),
    baseOpacity: rand(0.25, 0.65),
    opacitySpeed: rand(0.15, 0.45),
    opacityPhase: rand(0, Math.PI * 2),
    sizeSpeed: rand(0.15, 0.4),
    sizePhase: rand(0, Math.PI * 2),
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const area = width * height;
    const count = Math.round((area / (1920 * 1080)) * PARTICLE_COUNT);
    particles = Array.from(
      { length: Math.max(100, Math.min(600, count)) },
      () => createParticle(),
    );
  };

  const step = (time: number) => {
    ctx.clearRect(0, 0, width, height);
    const t = time / 1000;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      else if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      else if (p.y > height + 20) p.y = -20;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < BUBBLE_DISTANCE && dist > 0.001) {
        const force =
          ((BUBBLE_DISTANCE - dist) / BUBBLE_DISTANCE) * BUBBLE_PUSH;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      const opacity =
        p.baseOpacity *
        (0.5 + 0.5 * Math.sin(t * p.opacitySpeed + p.opacityPhase));
      const size =
        p.baseSize * (0.5 + 0.5 * Math.sin(t * p.sizeSpeed + p.sizePhase)) +
        0.4;

      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  };

  const onMouseMove = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };

  const onMouseLeave = () => {
    mouse.x = -99999;
    mouse.y = -99999;
  };

  const onClick = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < 4; i++) {
      particles.push(createParticle(x, y));
    }
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);
  canvas.addEventListener("click", onClick);
  raf = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onMouseLeave);
    canvas.removeEventListener("click", onClick);
  };
}
