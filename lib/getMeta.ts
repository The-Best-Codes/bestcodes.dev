import type { Metadata } from "next";

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev";

export default function getMeta(
  title: string,
  description: string,
  url?: string,
): Partial<Metadata> {
  const ogData = {
    title: title,
    description: description,
    url:
      `${siteBaseUrl}${url?.startsWith("/") ? url : `/${url}`}` || siteBaseUrl,
    siteName: "BestCodes — Official Website",
    type: "website",
  };
  const twitter = {
    card: "summary_large_image",
    title: title,
    description: description,
    site: "@the_best_codes",
    creator: "@the_best_codes",
  };

  return {
    title,
    description,
    openGraph: ogData,
    twitter,
  };
}
