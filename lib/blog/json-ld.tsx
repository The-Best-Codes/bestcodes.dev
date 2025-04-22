import type { PostMeta } from "@/lib/blog/getData";
import relativeToAbsolute from "@/lib/relativeToAbsolute";

export type JsonLdProps = {
  post: PostMeta;
  slug: string;
};

export const JsonLd = ({ post, slug }: JsonLdProps) => {
  try {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": relativeToAbsolute(`/blog/${slug}`),
      },
      url: relativeToAbsolute(`/blog/${slug}`),
      headline: post.title,
      image: [relativeToAbsolute(post?.image?.url)],
      datePublished: new Date(post.date.created).toISOString(),
      dateModified: post.date.updated
        ? new Date(post.date.updated).toISOString()
        : undefined,
      author: {
        "@type": "Person",
        name: post.author.name,
        url: relativeToAbsolute("/"),
      },
      description: post?.description || "Content on BestCodes Official Website",
      isAccessibleForFree: true,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};
