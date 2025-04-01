import { Button } from "@/components/ui/button";
import getMeta from "@/lib/getMeta";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = getMeta(
  "iframe detector: You are in an iframe | BestCodes",
  "Demo of my iframe detector - see how the detector identifies when content is loaded within an iframe",
  "/stuff/am-i-in-an-iframe/iframe",
);

export default function Page() {
  return (
    <main className="min-h-screen-hf w-full h-full flex justify-center items-center">
      <div className="space-y-6 p-4 max-w-xl">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Iframe Detector Demo</h1>
          <p className="text-muted-foreground">
            This page demonstrates how the iframe detector works when it is
            loaded inside an iframe. The content below is the same detector
            component, but now embedded inside an iframe.
          </p>

          <Button asChild>
            <Link href="/stuff/am-i-in-an-iframe" className="w-fit">
              <ArrowLeft /> Back to Detector
            </Link>
          </Button>
        </div>

        <div className="border rounded-md p-2">
          <iframe
            src="/stuff/am-i-in-an-iframe"
            title="iframe containing iframe detection"
            className="w-full min-h-96"
          />
        </div>

        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">How It Works</h3>
          <p>
            The detector uses JavaScript's Window.parent property to determine
            if a page is running inside an iframe. It checks if the current
            window is different from the top-level window and counts how many
            levels of nesting exist.
          </p>
        </div>
      </div>
    </main>
  );
}
