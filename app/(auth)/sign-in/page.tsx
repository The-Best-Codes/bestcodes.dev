import SignIn from "@/components/pages/sign-in";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = getMeta(
  "Sign In | BestCodes Official Website",
  "Sign in to your bestcodes.dev account",
  "/sign-in",
);

export default function Page() {
  <main className="flex flex-col justify-center items-center min-h-screen-hf">
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  </main>;
}
