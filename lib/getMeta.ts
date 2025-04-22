import type { Metadata } from "next";

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev";

// General pages
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

// Blog articles
interface BlogMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function getBlogMeta({
  title,
  description,
  image,
  url,
}: BlogMetaProps): Metadata {
  const absoluteUrl =
    `${siteBaseUrl}${url?.startsWith("/") ? url : `/${url}`}` || siteBaseUrl;

  const ogData = {
    title: title,
    description: description,
    siteName: "BestCodes — Official Website",
    type: "article",
    url: absoluteUrl,
    ...(image ? { images: [image] } : {}),
  };

  const twitter = {
    card: "summary_large_image" as const,
    title: title,
    description: description,
    site: "@the_best_codes",
    creator: "@the_best_codes",
    ...(image ? { images: [image] } : {}),
  };

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: ogData,
    twitter: twitter,
    alternates: {
      canonical: absoluteUrl,
    },
  };
}
