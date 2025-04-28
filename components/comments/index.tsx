"use client";
import { cn } from "@/lib/utils";
import { Comments } from "@fuma-comment/react";
import { useRouter } from "next/navigation";

export function CommentsWidget({
  page,
  className,
  signInRedirectUrl,
}: {
  page: string;
  className?: string;
  signInRedirectUrl?: string;
}) {
  const router = useRouter();

  const signIn = (signInRedirectUrl?: string) => {
    router.push(
      `/sign-in${signInRedirectUrl ? `?callbackUrl=${signInRedirectUrl}` : ""}`,
    );
  };

  return (
    <Comments
      page={page}
      className={cn(className, "w-full min-h-24 max-h-96 overflow-auto")}
      auth={{
        type: "api",
        signIn: () => signIn(signInRedirectUrl),
      }}
    />
  );
}
