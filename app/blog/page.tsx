import { BlogPostCard } from "@/components/global/blog-post-card";
import { getAllPublicPosts, PostMeta } from "@/lib/blog/getData";
import getMeta from "@/lib/getMeta";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "Blog | BestCodes Official Website",
  "Read insightful blog posts about web dev, tech, and more.",
  "/blog",
);

export default function BlogPage() {
  const posts = getAllPublicPosts([
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
        id="blog-posts"
        aria-label="Blog Posts"
        className="w-full p-2 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <h1 className="text-3xl text-foreground mb-6">All Blog Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(async (post, index) => (
              <BlogPostCard
                key={post.slug}
                post={post}
                isPriority={index < 4}
              />
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
