import HiddenUnicodeDetector from "@/components/pages/stuff/hidden-unicode-detector/client";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "Detect Hidden Unicode Characters in Text | BestCodes",
  "Paste your text and detect hidden unicode characters in it",
  "/stuff/hidden-unicode-characters",
);

export default function Page() {
  return (
    <main className="flex items-center justify-center min-h-screen-hf bg-background p-4 sm:p-6 md:p-8">
      <HiddenUnicodeDetector />
    </main>
  );
}
