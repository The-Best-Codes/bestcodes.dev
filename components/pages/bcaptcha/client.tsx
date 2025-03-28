"use client";

import { generateAndSetBCaptcha } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ACK_TIMEOUT = 5000; // 5 seconds
const RELOAD_INTERVAL = 4 * 60 * 1000; // 4 minutes

export default function BCaptchaComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  let buttonAria = "Click to confirm that you are not a robot";

  if (isLoading) {
    buttonText = "Loading...";
    buttonIcon = <Loader2 className="animate-spin" />;
    buttonAria = "Loading robot challenge";
  } else if (verificationState === "verifying") {
    buttonText = "Verifying...";
    buttonIcon = <Loader2 className="animate-spin" />;
    buttonAria = "Making sure you are not a robot";
  } else if (verificationState === "success") {
    buttonText = "Verified";
    buttonIcon = <ShieldCheck className="text-black dark:text-white" />;
    buttonAria = "Successfully confirmed that you are a human";
  } else if (verificationState === "error") {
    buttonText = "Failed, click to retry";
    buttonIcon = <ShieldAlert className="text-black dark:text-white" />;
    buttonAria = "There was an error checking if you are a human";
  }

  useEffect(() => {
    const reloadAndSendNewToken = async () => {
      // Send null token to parent
      window.parent.postMessage({ type: "bcaptcha-token", token: null }, "*");
      // Generate new token and set it.
      setIsLoading(true);
      try {
        const newToken = await generateAndSetBCaptcha();
        setToken(newToken);
        setVerificationState("idle"); // Reset verification state
      } catch (error) {
        console.error("Error generating new bcaptcha token:", error);
        setVerificationState("error");
      } finally {
        setIsLoading(false);
      }

      // Optionally, we can reload the entire iframe here, but not required
      // window.location.reload();
    };

    reloadTimeoutRef.current = setInterval(
      reloadAndSendNewToken,
      RELOAD_INTERVAL,
    );

    return () => {
      if (reloadTimeoutRef.current) {
        clearInterval(reloadTimeoutRef.current); // Use clearInterval
      }
    };
  }, []);

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
            "bg-green-300 hover:bg-green-400 dark:bg-green-900 text-black dark:text-white disabled:opacity-100",
          verificationState === "error" &&
            "bg-red-300 hover:bg-red-400 dark:bg-red-900 text-black dark:text-white",
        )}
        aria-label={buttonAria}
      >
        {buttonIcon}
        {buttonText}
      </Button>
    </div>
  );
}
