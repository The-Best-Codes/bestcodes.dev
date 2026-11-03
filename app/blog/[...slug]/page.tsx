import { BackButton } from "@/components/blog/back-button";
import { components as mdxComponents } from "@/components/blog/mdx-components";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPostBySlug, getPostSlugs } from "@/lib/blog/getData";
import { JsonLd } from "@/lib/blog/json-ld";
import getDynamicImageAsStatic from "@/lib/getImageDynamic";
import { getBlogMeta } from "@/lib/getMeta";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { highlighter } from "@/lib/shiki";
import { Info } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface PostParams {
  params: Promise<{ slug: string[] }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({
  params,
}: PostParams): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | BestCodes Blog",
      description: "The requested blog post could not be found on the server.",
      robots: { index: false, follow: false },
    };
  }

  return getBlogMeta({
    title: post.title,
    description: post.description,
    url: `/blog/${slug}`,
    image: post.image,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");

  const post = getPostBySlug(slug);
  if (!post) notFound();

  let headerImage: any = post.image?.url;
  if (post.image?.url && !post.image.external) {
    try {
      headerImage = await getDynamicImageAsStatic(post.image.url);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <main
      role="main"
      className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center p-2 sm:p-12 pt-2 sm:pt-4"
    >
      <JsonLd key={`json-ld-blog-${slug}`} post={post} slug={slug} />
      <div className="max-w-5xl w-full">
        <BackButton defaultHref="/blog" />
        <article className="bg-secondary border border-primary rounded-lg overflow-hidden">
          {post.image && post.image.url && (
            <div className="relative w-full h-fit overflow-hidden">
              <Image
                src={headerImage}
                alt={post.image.alt || `${post.title} header image`}
                placeholder={post.image.external ? "empty" : "blur"}
                width={post.image.external ? 958 : undefined}
                height={post.image.external ? 384 : undefined}
                priority
                className={`${
                  post.image.fit === "contain"
                    ? "object-contain"
                    : "object-cover"
                } object-center w-full`}
              />
            </div>
          )}

          <div className="p-2 sm:p-6 md:p-8">
            <header className="mb-8 border-b border-primary pb-2 sm:pb-4">
              <div className="max-w-none prose prose-sm sm:text-base md:text-lg">
                <h1 className="text-primary mb-2">{post.title}</h1>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
                  <span>{post.author.name || "BestCodes"}</span>
                  <span className="mx-0 hidden sm:mx-1 sm:block">&middot;</span>
                  <div className="flex flex-row">
                    <time dateTime={post.date.created}>
                      {formatDate(post.date.created)}
                    </time>
                    {post.date.updated && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger
                            aria-label="Updated on"
                            className="ml-1"
                          >
                            <Info className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent side="bottom" hideWhenDetached>
                            Updated on{" "}
                            <time dateTime={post.date.updated}>
                              {formatDate(post.date.updated)}
                            </time>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-sm text-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary prose-img:rounded-md prose-pre:rounded-md retro:prose-pre:rounded-none prose-pre:max-h-96 prose-quoteless">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkBreaks, remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "prepend",
                          content: {
                            type: "element",
                            tagName: "span",
                            properties: {
                              className:
                                "absolute opacity-0 hover:opacity-100 -ml-5 hidden sm:block",
                            },
                            children: [
                              {
                                type: "text",
                                value: "#",
                              },
                            ],
                          },
                        },
                      ],
                      [
                        rehypeShikiFromHighlighter,
                        await highlighter,
                        {
                          themes: {
                            light: "light-plus",
                            dark: "dark-plus",
                          },
                          fallbackLanguage: "text",
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>
          </div>
        </article>

        <div className="mt-2 sm:mt-6 flex justify-between items-center">
          <BackButton defaultHref="/blog" />
        </div>
      </div>
    </main>
  );
}
