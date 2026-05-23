"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function HireTimSfBanner() {
  const [expanded, setExpanded] = useState(false);
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("hire-tim-sf-banner-dismissed");
    if (dismissed) {
      setAlive(false);
    } else {
      setExpanded(true);
    }
  }, []);

  if (!alive) return null;

  return (
    <div
      className="overflow-hidden transition-[height] duration-300 ease"
      style={{
        height: expanded ? "auto" : 0,
        interpolateSize: "allow-keywords",
      }}
      onTransitionEnd={() => {
        if (!expanded) setAlive(false);
      }}
    >
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
            localStorage.setItem("hire-tim-sf-banner-dismissed", "true");
            setExpanded(false);
          }}
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label="Dismiss banner"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
