"use client";

import { generateAndSetBCaptcha } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const ACK_TIMEOUT = 5000; // 5 seconds

export default function BCaptchaComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function generateToken() {
      setIsLoading(true);
      try {
        const newToken = await generateAndSetBCaptcha();
        setToken(newToken);
      } catch (error) {
        console.error("Error generating bcaptcha token:", error);
        setVerificationState("error");
      } finally {
        setIsLoading(false);
      }
    }

    generateToken();
  }, []);

  useEffect(() => {
    const handleAck = (event: MessageEvent) => {
      if (
        window.location.origin === event.origin &&
        event.data.type === "bcaptcha-ack"
      ) {
        // Clear the timeout to prevent error state being set after success
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (event.data.success) {
          setVerificationState("success");
        } else {
          setVerificationState("error");
        }
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleAck);

    return () => {
      window.removeEventListener("message", handleAck);
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleVerifyClick = async () => {
    setVerificationState("verifying");
    setIsLoading(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      // Send the token to the parent window
      if (token) {
        window.parent.postMessage({ type: "bcaptcha-token", token }, "*");

        // Set a timeout and store the ID
        timeoutRef.current = setTimeout(() => {
          console.warn("BCaptcha Acknowledgement Timeout");
          setVerificationState("error");
          setIsLoading(false);
          timeoutRef.current = null;
        }, ACK_TIMEOUT);
      } else {
        console.error("Token is null or undefined. Verification failed.");
        setVerificationState("error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationState("error");
      setIsLoading(false);
    }
  };

  let buttonText = "Click to verify";
  let buttonIcon = <Shield />;

  if (isLoading) {
    buttonText = "Loading...";
    buttonIcon = <Loader2 className="animate-spin" />;
  } else if (verificationState === "verifying") {
    buttonText = "Verifying...";
    buttonIcon = <Loader2 className="animate-spin" />;
  } else if (verificationState === "success") {
    buttonText = "Verified";
    buttonIcon = <ShieldCheck className="text-black dark:text-white" />;
  } else if (verificationState === "error") {
    buttonText = "Failed, click to retry";
    buttonIcon = <ShieldAlert className="text-black dark:text-white" />;
  }

  return (
    <div className="w-full h-full">
      <Button
        variant="outline"
        disabled={
          isLoading ||
          verificationState === "success" ||
          verificationState === "verifying" ||
          !token
        }
        onClick={handleVerifyClick}
        className={cn(
          "w-full h-full text-lg justify-center",
          verificationState === "success" &&
            "bg-green-100 dark:bg-green-900 text-black dark:text-white disabled:opacity-100",
          verificationState === "error" &&
            "bg-red-100 dark:bg-red-900 text-black dark:text-white",
        )}
        aria-label="Click to confirm that you are not a robot"
      >
        {buttonIcon}
        {buttonText}
      </Button>
    </div>
  );
}
