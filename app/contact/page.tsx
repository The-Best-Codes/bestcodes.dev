import ContactFormClient from "@/components/pages/contact/client";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "Contact BestCodes | Official Website",
  "Contact BestCodes for any inquiries or support.",
  "/contact",
);

export default async function Page() {
  return (
    <main className="flex p-6 min-h-screen-hf scroll-smooth max-w-screen w-full flex-col items-center justify-center">
      <ContactFormClient />
    </main>
  );
}
