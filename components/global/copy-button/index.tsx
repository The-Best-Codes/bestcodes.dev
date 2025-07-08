"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, CopyCheck, CopyX } from "lucide-react";
import * as React from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function CopyButton({
  text,
  className,
  size = "sm",
  variant = "outline",
  onCopySuccess,
  onCopyError,
  children,
  disabled = false,
}: CopyButtonProps) {
  const [copyState, setCopyState] = React.useState<
    "idle" | "success" | "error"
  >("idle");
  const [isDisabled, setIsDisabled] = React.useState(disabled);

  const handleCopy = async () => {
    if (isDisabled) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("success");
      onCopySuccess?.();
    } catch (error) {
      setCopyState("error");
      onCopyError?.(error as Error);
    }

    // Disable button and reset state after 1 second
    setIsDisabled(true);
    setTimeout(() => {
      setCopyState("idle");
      setIsDisabled(false);
    }, 1000);
  };

  const getIcon = () => {
    switch (copyState) {
      case "success":
        return <CopyCheck className="h-3 w-3" />;
      case "error":
        return <CopyX className="h-3 w-3" />;
      default:
        return <Copy className="h-3 w-3" />;
    }
  };

  const getVariant = () => {
    if (copyState === "success") return "outline";
    if (copyState === "error") return "destructive";
    return variant;
  };

  return (
    <Button
      variant={getVariant()}
      size={size}
      onClick={handleCopy}
      disabled={isDisabled || disabled}
      className={cn(
        "transition-all duration-200",
        size === "sm" && "h-7 w-7 p-0",
        className,
      )}
    >
      {children || getIcon()}
    </Button>
  );
}
