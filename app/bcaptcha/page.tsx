import BCaptchaComponent from "@/components/pages/bcaptcha/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCaptcha | Internal Service",
  description: "BCaptcha is an internal service used by BestCodes.",
};

export default async function Page() {
  return (
    <main className="flex flex-col items-center justify-center overflow-hidden w-screen h-screen bg-background">
      <BCaptchaComponent />
    </main>
  );
}
