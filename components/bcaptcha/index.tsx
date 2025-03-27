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
      width="200"
      height="50"
      className="border border-border rounded-md bg-background"
      title="BCaptcha"
      aria-label="Please click on the button to prove that you are not a robot"
    />
  );
};

export default BCaptcha;
