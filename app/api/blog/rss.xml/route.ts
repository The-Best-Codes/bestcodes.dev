import { getAllPosts, PostMeta } from "@/lib/blog/getData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev";

export async function GET() {
  const posts = getAllPosts([
    "slug",
    "title",
    "date",
    "description",
    "image",
  ]) as PostMeta[];

  posts.sort(
    (a, b) =>
      new Date(b.date.created).getTime() - new Date(a.date.created).getTime(),
  );

  const feedItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date.created).toUTCString();

      let imageUrl = post.image?.url;
      if (imageUrl) {
        try {
          imageUrl = new URL(imageUrl, siteUrl).href;
        } catch (error) {
          console.error("URL error with image: ", error);
        }
      }

      let descriptionContent = "";
      if (imageUrl) {
        descriptionContent += `<img src="${imageUrl}" alt="${escapeXml(post?.image?.alt || post.title)}" /><br/>`;
      }
      descriptionContent += escapeXml(post.description || "");

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${descriptionContent}</description>
        </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BestCodes Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Read insightful blog posts about web dev, tech, and more from BestCodes.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>`;

  function escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
      }
      return c;
    });
  }

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
