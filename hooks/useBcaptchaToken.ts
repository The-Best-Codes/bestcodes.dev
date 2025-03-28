import { useEffect, useState } from "react";

function useBCaptchaToken() {
  const [bcaptchaToken, setBCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    let allowedOrigins: String[] = [];
    try {
      allowedOrigins = JSON.parse(
        process.env.NEXT_PUBLIC_BCAPTCHA_EVENT_ORIGINS || "[]",
      ) as string[];
    } catch (error) {
      console.error(`Error parsing allowed origins in bcaptcha: ${error}`);
    }

    if (process.env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:3000");
    }

    const handleMessage = (event: MessageEvent) => {
      if (allowedOrigins.includes(event.origin)) {
        if (event.data && event.data.type === "bcaptcha-token") {
          setBCaptchaToken(event.data.token);

          // Send Acknowledgement back to the iframe
          event.source?.postMessage(
            {
              type: "bcaptcha-ack",
              success: true,
              origin: window.location.origin,
            },
            { targetOrigin: event.origin },
          );
        }
      } else {
        console.warn(
          `Ignoring message from unauthorized origin: ${event.origin}`,
        );
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return { bcaptchaToken };
}

export default useBCaptchaToken;
