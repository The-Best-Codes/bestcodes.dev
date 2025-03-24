"use client";
import { ReactMatrixAnimation } from "./matrix";
import { useEffect, useState } from "react";

const MatrixThemed = () => {
  const [theme, setTheme] = useState("dark"); // Default to dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on the client-side
    setMounted(true);

    const updateThemeFromHtml = () => {
      const html = document.documentElement;
      const hasDarkClass = html.classList.contains("dark");
      setTheme(hasDarkClass ? "dark" : "light");
    };

    // Initial theme load
    updateThemeFromHtml();

    // Create a MutationObserver to watch for changes to the class list on the HTML element.
    const observer = new MutationObserver(updateThemeFromHtml);

    // Configure the observer to watch for class attribute changes on the documentElement.
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup the observer when the component unmounts.
    return () => {
      observer.disconnect();
    };
  }, []);

  // Don't render anything until mounted (client-side)
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
