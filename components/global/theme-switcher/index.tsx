import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { ThemeSwitcherClient } from "./client";

export function ThemeSwitcher() {
  return (
    <Suspense
      fallback={
        <div className="flex h-9 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ThemeSwitcherClient />
    </Suspense>
  );
}
