import ContactFormClient from "@/components/pages/contact/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact BestCodes | Official Website",
  description: "Contact BestCodes for any inquiries or support.",
};

export default function Page() {
  return (
    <main className="flex p-6 min-h-screen scroll-smooth max-w-screen w-full flex-col items-center justify-center">
      <ContactFormClient />
    </main>
  );
}
