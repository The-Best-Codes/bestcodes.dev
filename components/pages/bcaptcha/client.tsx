"use client";

import { generateAndSetBCaptcha } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function BCaptchaComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

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

  const handleVerifyClick = async () => {
    setVerificationState("verifying");
    setIsLoading(true);
    try {
      setVerificationState("success");

      // Send the token to the parent window
      if (token) {
        window.parent.postMessage({ type: "bcaptcha-token", token }, "*");
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
    buttonText = "Verification Failed";
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
          verificationState === "error" ||
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
