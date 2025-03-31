"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";

const IframeDepthChecker: React.FC = () => {
  const [depth, setDepth] = useState<number | null>(null);

  useEffect(() => {
    const getIframeDepth = (): number => {
      let calculatedDepth = 0;
      let currentWindow: Window | null = window;

      try {
        // Loop while the current window is not the top-most window
        // and we can access its parent
        while (currentWindow && currentWindow !== window.top) {
          calculatedDepth++;
          // Check if parent exists and is accessible before assigning
          if (currentWindow.parent && currentWindow.parent !== currentWindow) {
            currentWindow = currentWindow.parent;
          } else {
            // Cannot access parent (likely cross-origin) or weird state, stop counting
            console.warn(
              "Stopped depth calculation: Cannot access parent window or reached unexpected state.",
            );
            break;
          }
        }
      } catch (error) {
        console.error(
          "Error accessing parent window, likely due to cross-origin restrictions. Reporting depth up to this point.",
          error,
        );
        // The loop naturally stops on error, depth holds the count until the error
      }

      return calculatedDepth;
    };

    const detectedDepth = getIframeDepth();
    setDepth(detectedDepth);
  }, []);

  const renderStatus = () => {
    if (depth === null) {
      return <p className="text-gray-500">Detecting iframe status...</p>;
    } else if (depth === 0) {
      return (
        <p className="text-green-600 dark:text-green-400 font-medium">
          This page is NOT running inside an iframe.
        </p>
      );
    } else {
      return (
        <p className="text-blue-600 dark:text-blue-400 font-medium">
          This page is nested inside{" "}
          <span className="font-bold text-xl">{depth}</span> iframe
          {depth > 1 ? "s" : ""}.
        </p>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Iframe Nesting Detector</CardTitle>
          <CardDescription>
            Checks if this page is loaded within an iframe and displays its
            nesting depth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 text-center text-lg">{renderStatus()}</div>
          {depth !== null && depth > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Note: Cross-origin restrictions might prevent detection of the
              full nesting depth if parent frames are on different domains. The
              reported depth is how many accessible parent frames were found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IframeDepthChecker;
