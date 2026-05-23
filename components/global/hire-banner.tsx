"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function HireBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("hire-banner-dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-primary px-4 py-2 text-sm text-primary-foreground">
      <span>
        New page! Check out the{" "}
        <Link
          href="/hire-tim-sf"
          className="font-semibold underline underline-offset-2 hover:no-underline"
        >
          &ldquo;Hire Tim SF&rdquo;
        </Link>{" "}
        page.
      </span>
      <Button
        onClick={() => {
          localStorage.setItem("hire-banner-dismissed", "true");
          setVisible(false);
        }}
        variant="ghost"
        size="icon"
        className="size-6"
        aria-label="Dismiss banner"
      >
        <X />
      </Button>
    </div>
  );
}
