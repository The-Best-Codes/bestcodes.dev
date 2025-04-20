import { getAllPosts, PostMeta } from "@/lib/blog/getData";
import getMeta from "@/lib/getMeta";
import { sanitizeHtml } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = getMeta(
  "Blog | BestCodes Official Website",
  "Ready the latest blog posts by BestCodes",
  "/blog",
);

export default function BlogPage() {
  const posts = getAllPosts([
    "slug",
    "title",
    "date",
    "description",
    "image",
    "author",
    "tags",
  ]) as PostMeta[];

  return (
    <main
      role="main"
      className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center"
    >
      <section
        id="blog-header"
        aria-label="Blog Header Section"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Blog
          </h1>
          <p className="text-lg text-foreground mb-6">
            Thoughts, ideas, and insights on coding, web development, and
            technology.
          </p>
        </div>
      </section>

      <section
        id="blog-posts"
        aria-label="Blog Posts Section"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-secondary border border-primary rounded-md overflow-hidden hover:border-primary/80 transition-all duration-300 flex flex-col h-full"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        post.image?.url ||
                        "/image/best_codes_logo_low_res.png"
                      }
                      alt={sanitizeHtml(post.title)}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {post.tags && post.tags.length > 0 && (
                      <div className="absolute top-2 right-2 flex flex-wrap gap-2 justify-end">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-primary/80 text-background px-2 py-1 text-xs rounded-md"
                          >
                            {sanitizeHtml(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-2 flex items-center text-sm text-foreground/70">
                    <span>{sanitizeHtml(post.author.name)}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={post.date.created}>
                      {new Date(post.date.created).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </time>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-foreground">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {sanitizeHtml(post.title)}
                    </Link>
                  </h2>
                  <p className="text-foreground/80 mb-4 flex-grow">
                    {sanitizeHtml(post.description)}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Read more <span className="ml-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center p-12 bg-secondary border border-primary rounded-md">
              <h2 className="text-2xl text-foreground mb-2">No posts yet</h2>
              <p className="text-foreground/80">
                Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
