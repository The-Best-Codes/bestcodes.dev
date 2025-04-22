import type { Metadata } from "next";

// General pages
export default function getMeta(
  title: string,
  description: string,
  url?: string,
): Partial<Metadata> {
  const ogData = {
    title: title,
    description: description,
    url: url || "",
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
  image?: { url: string; alt?: string };
  url?: string;
  tags?: string[];
}

export function getBlogMeta({
  title,
  description,
  image,
  url,
  tags,
}: BlogMetaProps): Metadata {
  const ogData = {
    title: title,
    description: description,
    siteName: "BestCodes — Official Website",
    type: "article",
    url: url || "",
    images: image ? [image] : [],
  };

  const twitter = {
    card: "summary_large_image" as const,
    title: title,
    description: description,
    site: "@the_best_codes",
    creator: "@the_best_codes",
    images: image ? [image] : [],
  };

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      }
    },
    openGraph: ogData,
    twitter: twitter,
    alternates: {
      canonical: url || "",
    },
    keywords: tags || undefined,
  };
}
