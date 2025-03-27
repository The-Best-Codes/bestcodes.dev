"use client";

import { generateAndSetBCaptcha } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function BCaptchaComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  useEffect(() => {
    async function generateToken() {
      setLoading(true);
      try {
        const newToken = await generateAndSetBCaptcha();
        setToken(newToken);
      } catch (error) {
        console.error("Error generating bcaptcha token:", error);
        setVerificationState("error");
      } finally {
        setLoading(false);
      }
    }

    generateToken();
  }, []);

  useEffect(() => {
    if (isChecked && token) {
      setVerificationState("verifying");

      setVerificationState("success");
      // Send the token to the parent window
      window.parent.postMessage({ type: "bcaptcha-token", token }, "*");

      return () => {
        setVerificationState("idle");
      };
    }
  }, [isChecked, token]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    if (!checked) {
      setVerificationState("idle");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-2">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            verificationState === "success"
              ? "bg-green-100 dark:bg-green-900/30"
              : verificationState === "error"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-muted",
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : verificationState === "success" ? (
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : verificationState === "error" ? (
            <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : verificationState === "verifying" ? (
            <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
          ) : (
            <Shield className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bcaptcha"
              checked={isChecked}
              disabled={loading || verificationState === "error"}
              onCheckedChange={handleCheckboxChange}
              className={cn(
                verificationState === "success" &&
                  "border-green-500 bg-green-500",
                verificationState === "verifying" && "border-blue-500",
              )}
            />
            <Label
              htmlFor="bcaptcha"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I&apos;m not a robot
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
