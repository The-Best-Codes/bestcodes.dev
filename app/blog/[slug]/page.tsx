import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostBySlug, getPostSlugs, PostMeta } from "@/lib/blog/getData";
import getMeta from "@/lib/getMeta";
import { sanitizeHtml } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkBreaks from "remark-breaks";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { RehypeShikiCoreOptions } from "@shikijs/rehype/core";
import shikiHighlighter from "@/lib/shiki";
import { components as mdxComponents } from "@/components/blog/mdx-components";

interface PostParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostParams): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug, ["title", "description"]) as PostMeta;

    return getMeta(
      `${post.title || "Untitled Blog Post on BestCodes Official Website"}`,
      post.description || "A blog post by BestCodes",
      `/blog/${slug}`
    );
  } catch (error) {
    return getMeta(
      "Post Not Found | BestCodes Blog",
      "The requested blog post could not be found.",
      `/blog/${slug}`
    );
  }
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug } = await params;

  let post: PostMeta;
  try {
    post = getPostBySlug(slug, [
      "content",
      "title",
      "date",
      "author",
      "image",
      "tags",
      "slug",
    ]) as PostMeta;
  } catch (error) {
    notFound();
  }

  const highlighter = await shikiHighlighter;

  const formattedDate = new Date(post.date.created).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main
      role="main"
      className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center p-2 sm:p-12 pt-2 sm:pt-4"
    >
      <div className="max-w-4xl w-full">
        <Button variant="outline" size="sm" className="mb-2 sm:mb-6" asChild>
          <Link href="/blog">
            <ArrowLeft />
            Back to all posts
          </Link>
        </Button>

        <article className="bg-secondary border border-primary rounded-lg overflow-hidden">
          {post.image && post.image.url && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
              <Image
                src={post.image.url}
                alt={
                  sanitizeHtml(post?.image?.alt) ||
                  `${sanitizeHtml(post.title)} header image`
                }
                width={896}
                height={384}
                priority
                className={`${
                  post.image.fit === "cover" ? "object-cover" : "object-contain"
                }`}
              />
            </div>
          )}

          <div className="p-2 sm:p-6 md:p-8">
            <header className="mb-8 border-b border-primary pb-2 sm:pb-6">
              <div className="prose prose-sm sm:text-base md:text-lg">
                <h1 className="text-primary mb-2">
                  {sanitizeHtml(post.title)}
                </h1>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
                  <span>{sanitizeHtml(post.author.name || "BestCodes")}</span>
                  <span className="mx-0 hidden sm:mx-1 sm:block">&middot;</span>
                  <time dateTime={post.date.created}>{formattedDate}</time>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="default">
                        {sanitizeHtml(tag)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-sm sm:text-base md:text-lg dark:prose-invert max-w-none prose-headings:text-primary prose-headings:mb-0 prose-a:text-primary prose-img:rounded-md">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkBreaks],
                    rehypePlugins: [
                      [
                        rehypeShikiFromHighlighter,
                        highlighter,
                        {
                          theme: "min-dark",
                        } as RehypeShikiCoreOptions,
                      ],
                    ],
                  },
                }}
              />
            </div>
          </div>
        </article>

        <div className="mt-2 sm:mt-6 flex justify-between items-center">
          <Button size="sm" variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft />
              Back to all posts
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
