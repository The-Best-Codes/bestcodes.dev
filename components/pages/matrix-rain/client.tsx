"use client";
import { ReactMatrixAnimation } from "./matrix";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const MatrixThemed = () => {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (resolvedTheme) {
      setTheme(resolvedTheme.includes("dark") ? "dark" : "light");
    }
  }, [resolvedTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <ReactMatrixAnimation
      key={theme}
      textColor="rgba(59, 130, 246, 1)"
      backgroundColor={
        theme === "dark" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)"
      }
    />
  );
};

export default MatrixThemed;
