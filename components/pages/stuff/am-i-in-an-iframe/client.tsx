"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";

interface ParentFrameInfo {
  level: number;
  url: string | null;
  accessible: boolean;
  title: string | null;
}

const IframeDepthChecker: React.FC = () => {
  const [depth, setDepth] = useState<number | null>(null);
  const [parentFrames, setParentFrames] = useState<ParentFrameInfo[]>([]);

  useEffect(() => {
    const collectFrameInfo = (): {
      depth: number;
      frames: ParentFrameInfo[];
    } => {
      let calculatedDepth = 0;
      let currentWindow: Window | null = window;
      const frameInfos: ParentFrameInfo[] = [];

      try {
        // Collect information about the current window first
        frameInfos.push({
          level: 0,
          url: window.location.href,
          accessible: true,
          title: document.title || "Current Page",
        });

        // Loop while the current window is not the top-most window
        while (currentWindow && currentWindow !== window.top) {
          calculatedDepth++;

          try {
            // Try to access parent information
            const parentWindow: Window = currentWindow.parent;
            if (parentWindow && parentWindow !== currentWindow) {
              // Attempt to get parent information
              let url = null;
              let title = null;
              let accessible = false;

              try {
                url = parentWindow.location.href;
                title = parentWindow.document.title;
                accessible = true;
              } catch (e) {
                // Cross-origin restriction
                accessible = false;
              }

              frameInfos.unshift({
                level: calculatedDepth,
                url,
                accessible,
                title: title || `Parent Frame ${calculatedDepth}`,
              });

              currentWindow = parentWindow;
            } else {
              break;
            }
          } catch (e) {
            // Add inaccessible parent to the list
            frameInfos.unshift({
              level: calculatedDepth,
              url: null,
              accessible: false,
              title: `Parent Frame ${calculatedDepth} (inaccessible)`,
            });
            break;
          }
        }
      } catch (error) {
        console.error("Error accessing parent window hierarchy:", error);
      }

      return { depth: calculatedDepth, frames: frameInfos };
    };

    const { depth: detectedDepth, frames } = collectFrameInfo();
    setDepth(detectedDepth);
    setParentFrames(frames);
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

  const renderFrameHierarchy = () => {
    if (!parentFrames.length || depth === null) return null;

    return (
      <div className="mt-6 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium mb-3 text-sm">Frame Hierarchy:</h3>
        <div className="space-y-2">
          {parentFrames.map((frame, index) => {
            // Determine if this is the current page (last item)
            const isCurrentPage = index === parentFrames.length - 1;

            return (
              <div
                key={index}
                className={`relative pl-6 ${
                  isCurrentPage
                    ? "text-primary font-medium"
                    : frame.accessible
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-500 dark:text-gray-500"
                }`}
              >
                {/* Connection lines */}
                {index > 0 && (
                  <div className="absolute left-2 top-0 h-full w-0.5 -mt-2 bg-gray-300 dark:bg-gray-700"></div>
                )}
                {/* Horizontal connector */}
                <div className="absolute left-2 top-1/2 w-3 h-0.5 bg-gray-300 dark:bg-gray-700"></div>

                {/* Frame indicator with number */}
                <div
                  className={`
                  flex items-center gap-2
                  ${isCurrentPage ? "text-primary" : ""}
                `}
                >
                  <div
                    className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-xs
                    ${
                      isCurrentPage
                        ? "bg-primary text-primary-foreground"
                        : frame.accessible
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-500"
                    }
                  `}
                  >
                    {index + 1}
                  </div>

                  {/* Frame information */}
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">
                      {frame.title ||
                        (isCurrentPage
                          ? "Current Page"
                          : `Frame ${frame.level}`)}
                    </div>
                    {frame.url ? (
                      <div className="text-xs truncate opacity-70">
                        {frame.url}
                      </div>
                    ) : (
                      <div className="text-xs italic opacity-60">
                        {isCurrentPage
                          ? window.location.href
                          : "Cross-origin frame (details unavailable)"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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

          {renderFrameHierarchy()}

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
