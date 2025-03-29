"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    setHasHistory(window.history.length > 1);
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
        >
          Go back
        </Button>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
