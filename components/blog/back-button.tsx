"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

interface BackButtonProps {
  defaultHref: string;
}

export function BackButton({ defaultHref }: BackButtonProps) {
  return (
    <Suspense fallback={<Skeleton className="w-40 h-8"></Skeleton>}>
      <Component defaultHref={defaultHref} />
    </Suspense>
  );
}

function Component({ defaultHref }: BackButtonProps) {
  const searchParams = useSearchParams();
  const backButtonUrl = searchParams.get("backButtonUrl");
  let backButtonHref = defaultHref;

  if (backButtonUrl) {
    backButtonHref = backButtonUrl;
  }

  return (
    <Button variant="outline" size="sm" className="mb-2 sm:mb-6" asChild>
      <Link href={backButtonHref}>
        <ArrowLeft />
        {backButtonHref !== defaultHref ? "Back" : "Back to All Posts"}
      </Link>
    </Button>
  );
}
