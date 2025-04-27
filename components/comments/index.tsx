"use client";
import { cn } from "@/lib/utils";
import { Comments } from "@fuma-comment/react";
import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

const signIn = (signInRedirectUrl?: string) => {
  void authClient.signIn.social({
    provider: "github",
    callbackURL: signInRedirectUrl || "/",
  });
};

export function CommentsWidget({
  page,
  className,
  signInRedirectUrl,
}: {
  page: string;
  className?: string;
  signInRedirectUrl?: string;
}) {
  return (
    <Comments
      page={page}
      className={cn(className, "w-full min-h-24 max-h-96")}
      auth={{
        type: "api",
        signIn: () => signIn(signInRedirectUrl),
      }}
    />
  );
}
