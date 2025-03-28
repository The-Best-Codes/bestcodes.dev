import { useEffect, useState } from "react";

function useBCaptchaToken() {
  const [bcaptchaToken, setBCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "bcaptcha-token") {
        setBCaptchaToken(event.data.token);
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
