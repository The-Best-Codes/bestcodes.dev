import NotFound from "@/components/pages/not-found";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "404 — Page Not Found",
  "This page does not exist.",
);

export default function Page() {
  return <NotFound />;
}
