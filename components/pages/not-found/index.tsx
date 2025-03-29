"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NotFound() {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);
  const [oldWebsiteUrl, setOldWebsiteUrl] = useState<string | null>(null);

  useEffect(() => {
    setHasHistory(window.history.length > 1);
    // Extract the current path from the URL and construct the old website URL
    const currentPath = window.location.pathname;
    const oldWebsiteBaseUrl = "https://bestcodes.dev";
    setOldWebsiteUrl(`${oldWebsiteBaseUrl}${currentPath}`);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-hf bg-background">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        404 &mdash; Page Not Found
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Sorry, the page you were looking for could not be found.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          disabled={!hasHistory}
          variant="outline"
          onClick={() => router.back()}
          size="lg"
        >
          Go back
        </Button>
        <Button size="lg" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
      <div className="mt-6">
        <Accordion type="single" collapsible>
          <AccordionItem className="w-96" value="try-old-site">
            <AccordionTrigger>But this page used to work!</AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  You are currently viewing the new website. If you are certain
                  that this URL used to work, it was likely on the old website.
                </p>
                <Button size="sm" disabled={!oldWebsiteUrl}>
                  <Link
                    href={oldWebsiteUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Old Website
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
