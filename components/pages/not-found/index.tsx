"use client";

import OutboundLink from "@/components/global/links/outbound";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);
  const [oldWebsiteUrl, setOldWebsiteUrl] = useState<string | null>(null);

  useEffect(() => {
    setHasHistory(window.history.length > 1);
    // Extract the current path from the URL and construct the old website URL
    const currentPath = window.location.pathname;
    const oldWebsiteBaseUrl = "https://old-site.bestcodes.dev";
    setOldWebsiteUrl(`${oldWebsiteBaseUrl}${currentPath}`);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-hf bg-background">
      <h1 className="text-4xl text-center font-bold text-foreground mb-4">
        404 &mdash; Page Not Found
      </h1>
      <p className="text-muted-foreground text-center mb-6">
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
          <AccordionItem
            className="w-60 max-w-full sm:w-96"
            value="try-old-site"
          >
            <AccordionTrigger>But this page used to work!</AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  You are currently viewing the new website. If you are certain
                  that this URL used to work, it was likely on the old website.
                </p>
                <Button size="sm" disabled={!oldWebsiteUrl}>
                  <OutboundLink
                    href={oldWebsiteUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Old Website
                  </OutboundLink>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            className="w-60 max-w-full sm:w-96"
            value="broken-blog-post"
          >
            <AccordionTrigger>
              I thought this was a blog post...
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  If you expected this to be a blog post, it might have been
                  moved or deleted. It may also contain invalid content, in
                  which case it will show this 404 page. You can try finding the
                  blog post on dev.to (my secondary blogging platform).
                </p>
                <Button size="sm">
                  <OutboundLink
                    href="https://dev.to/best_codes"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BestCodes on Dev.to
                  </OutboundLink>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
