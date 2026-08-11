"use client";

import { useEffect, useRef, useState } from "react";
import { initParticles } from "./particles";

const MAGIC_WORD = "capybara";
const CAPYBARA_GIF = "https://media.tenor.com/7Tf1BronXsIAAAAM/capybara.gif";

export default function SussySandwichShoutout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const bufferRef = useRef("");

  useEffect(() => {
    if (!canvasRef.current) return;
    return initParticles(canvasRef.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (!/^[a-z]$/.test(key)) {
        bufferRef.current = "";
        return;
      }
      bufferRef.current = (bufferRef.current + key).slice(-MAGIC_WORD.length);
      if (bufferRef.current === MAGIC_WORD) {
        setRevealed(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="relative min-h-screen-hf overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #040418 0%, #0b0630 50%, #1c0c45 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex min-h-screen-hf flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-white/85 sm:text-4xl">
          Shoutout to
        </h1>
        <h2 className="mt-3 text-6xl leading-tight font-extrabold text-white sm:text-8xl">
          SussySandwich445
        </h2>
        <p className="mt-4 text-2xl font-medium text-purple-200/90 sm:text-3xl">
          Very Cool Person!
        </p>
      </div>

      {revealed && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-20 flex justify-center">
          <img
            src={CAPYBARA_GIF}
            alt="A dancing capybara"
            width={180}
            height={240}
            className="h-40 w-auto rounded-2xl shadow-lg shadow-purple-950/50 md:h-56"
            style={{ animation: "capy-in 0.4s ease both" }}
          />
        </div>
      )}

      <style>{`
        @keyframes capy-in {
          from { opacity: 0; transform: translateY(16px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </main>
  );
}
