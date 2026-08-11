import SussySandwichShoutout from "@/components/pages/stuff/susssandwich/client";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "Shoutout to SussySandwich445 | BestCodes",
  "A random shoutout to a random cool person - SussySandwich445",
  "/stuff/susssandwich",
);

export default function Page() {
  return <SussySandwichShoutout />;
}
