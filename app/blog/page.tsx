import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllPosts, PostMeta } from "@/lib/blog/getData";
import { getImageBlurURL } from "@/lib/getImageDynamic";
import getMeta from "@/lib/getMeta";
import { cn, sanitizeHtml } from "@/lib/utils";
import { escape } from "lodash";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = getMeta(
  "Blog | BestCodes Official Website",
  "Read insightful blog posts about web dev, tech, and more.",
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
        id="blog-posts"
        aria-label="Blog Posts"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <h3 className="text-3xl text-foreground mb-6">Blog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(async (post) => (
              <article
                key={post.slug}
                className="max-w-md w-full bg-background rounded-md overflow-hidden focus-within:ring focus-within:ring-primary flex flex-col h-full"
              >
                {post?.image?.url && (
                  <div className="relative">
                    <div className="absolute inset-0 overflow-hidden">
                      {post.image.external ? (
                        <Image
                          src={post.image.url}
                          alt={`${sanitizeHtml(post.title)} Preview Blurred Background`}
                          aria-hidden="true"
                          width={448}
                          height={192}
                          quality={10}
                          priority={false}
                          loading="lazy"
                          className="opacity-70 w-full h-full object-cover object-center scale-150 blur-lg"
                        />
                      ) : (
                        <img
                          src={await getImageBlurURL(
                            `public/${post.image.url}`,
                          )}
                          alt={`${sanitizeHtml(post.title)} Preview Blurred Background`}
                          aria-hidden="true"
                          width={448}
                          height={192}
                          className="opacity-70 w-full h-full object-cover object-center scale-150 blur-lg"
                        />
                      )}
                    </div>

                    <div className="h-48 w-full relative z-10 flex items-center justify-center">
                      <Image
                        src={post.image.url}
                        alt={`${sanitizeHtml(post.title)} Preview`}
                        width={448}
                        height={192}
                        quality={25}
                        className={cn(
                          "max-w-full max-h-48",
                          post.image.fit === "contain"
                            ? "object-contain w-auto h-auto"
                            : "object-cover w-full h-full",
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <Link
                      href={`/blog/${escape(post.slug)}`}
                      className="hover:underline text-primary"
                    >
                      <h2 className="text-2xl font-bold mb-2">
                        {sanitizeHtml(post.title)}
                      </h2>
                    </Link>

                    <div
                      hidden
                      aria-hidden="true"
                      className="flex flex-wrap gap-2 mb-4"
                    >
                      {post.tags &&
                        post.tags.map((tag: string, index) => (
                          <Badge key={index}>{sanitizeHtml(tag)}</Badge>
                        ))}
                    </div>

                    <p className="text-foreground max-h-40 overflow-auto mb-4">
                      {sanitizeHtml(post.description)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-primary mt-auto">
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
                      <span>{sanitizeHtml(post.author.name)}</span>
                      <span className="mx-0 hidden sm:mx-1 sm:block">
                        &middot;
                      </span>
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
                    <Button
                      variant="link"
                      size="sm"
                      className="text-sm h-fit"
                      asChild
                    >
                      <Link
                        href={`/blog/${escape(post.slug)}`}
                        style={{ padding: "0px" }}
                      >
                        Read article
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
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
