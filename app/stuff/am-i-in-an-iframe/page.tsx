import IframeDepthChecker from "@/components/pages/stuff/am-i-in-an-iframe/client";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "Am I in an iFrame? | BestCodes",
  "Detect if the current page is in an iframe and if so, how deeply it is nested",
  "/stuff/am-i-in-an-iframe",
);

export default function Page() {
  return <IframeDepthChecker />;
}
