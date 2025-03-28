"use client";

import { generateAndSetBCaptcha } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const ACK_TIMEOUT = 5000; // 5 seconds

// TODO:
// FIX BROKEN TIMEOUTS AND WEIRD RANDOM ERRORS

export default function BCaptchaComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [ackReceived, setAckReceived] = useState(false);

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
        window.location.origin === event.data.origin &&
        event.data.type === "bcaptcha-ack"
      ) {
        if (event.data.success) {
          setVerificationState("success");
          setAckReceived(true);
        } else {
          setVerificationState("error");
          setAckReceived(false);
        }
      }
    };

    window.addEventListener("message", handleAck);

    return () => {
      window.removeEventListener("message", handleAck);
    };
  }, []);

  const handleVerifyClick = async () => {
    setVerificationState("verifying");
    setIsLoading(true);
    setAckReceived(false); // Reset ack state on click

    let timeoutId: NodeJS.Timeout | null = null;

    try {
      // Send the token to the parent window
      if (token) {
        window.parent.postMessage({ type: "bcaptcha-token", token }, "*");

        // Set a timeout
        timeoutId = setTimeout(() => {
          console.warn("BCaptcha Acknowledgement Timeout");
          setVerificationState("error");
          setIsLoading(false);
        }, ACK_TIMEOUT);
      } else {
        console.error("Token is null or undefined. Verification failed.");
        setVerificationState("error");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationState("error");
    } finally {
      setIsLoading(false);
    }

    // Clear timeout if ack is received
    if (ackReceived && timeoutId) {
      clearTimeout(timeoutId);
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
