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
      width="300"
      height="150"
      style={{ border: "1px solid #ccc" }}
      title="BCaptcha"
    />
  );
};

export default BCaptcha;
