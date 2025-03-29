import NotFound from "@/components/pages/not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "This page does not exist.",
};

export default function Page() {
  return <NotFound />;
}
