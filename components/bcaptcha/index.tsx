"use client";
import { useEffect } from "react";

interface BCaptchaProps {
  onTokenReceived: (token: string) => void;
}

const BCaptcha: React.FC<BCaptchaProps> = ({ onTokenReceived }) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "bcaptcha-token") {
        onTokenReceived(event.data.token);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onTokenReceived]);

  return (
    <iframe
      src="/bcaptcha"
      width="250"
      height="75"
      className="border border-primary rounded-md"
      title="BCaptcha"
    />
  );
};

export default BCaptcha;
