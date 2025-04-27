import SignIn from "@/components/pages/sign-in";
import { Card } from "@/components/ui/card";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = getMeta(
  "Sign In | BestCodes Official Website",
  "Sign in to your bestcodes.dev account",
  "/sign-in",
);

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen-hf p-6">
      <Suspense
        fallback={
          <Card className="max-w-md w-full h-52 flex flex-col justify-center items-center">
            Loading...
          </Card>
        }
      >
        <SignIn />
      </Suspense>
    </main>
  );
}
