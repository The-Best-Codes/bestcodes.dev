"use client";
import { cn } from "@/lib/utils";
import { Comments } from "@fuma-comment/react";
import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

const signIn = () => {
  void authClient.signIn.social({
    provider: "github",
  });
};

export function CommentsWidget({
  page,
  className,
}: {
  page: string;
  className?: string;
}) {
  return (
    <Comments
      page={page}
      className={cn(className, "w-full min-h-24 max-h-96")}
      auth={{
        type: "api",
        signIn,
      }}
    />
  );
}
