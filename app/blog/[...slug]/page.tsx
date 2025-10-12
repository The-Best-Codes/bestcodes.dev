import { BackButton } from "@/components/blog/back-button";
import { components as mdxComponents } from "@/components/blog/mdx-components";
import { PostMetrics } from "@/components/blog/post-metrics";
import { UnpublishedAuth } from "@/components/blog/unpublished-auth";
import { CommentsWidget } from "@/components/comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isAuthorizedForUnpublished, isUnpublishedPost } from "@/lib/blog/auth";
import { doesSlugExist } from "@/lib/blog/doesPostExist";
import { getPostBySlug, getPostSlugs, PostMeta } from "@/lib/blog/getData";
import { JsonLd } from "@/lib/blog/json-ld";
import getDynamicImageAsStatic from "@/lib/getImageDynamic";
import { getBlogMeta } from "@/lib/getMeta";
import shikiHighlighter from "@/lib/shiki";
import { sanitizeHtml } from "@/lib/utils";
import type { RehypeShikiCoreOptions } from "@shikijs/rehype/core";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { ArrowUp, Info, MessagesSquare } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface PostParams {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({
  params,
}: PostParams): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");

  try {
    const exists = doesSlugExist(slug);
    if (!exists) {
      return {
        title: "Post Not Found | BestCodes Blog",
        description:
          "The requested blog post could not be found on the server.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    if (isUnpublishedPost(slug)) {
      const isAuthorized = await isAuthorizedForUnpublished();
      if (!isAuthorized) {
        return {
          title: "Authorization Required | BestCodes Blog",
          description: "This blog post requires authorization to view.",
          robots: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
            noimageindex: true,
          },
        };
      }

      const post = getPostBySlug(slug, [
        "title",
        "description",
        "image",
        "tags",
      ]) as PostMeta;

      const blogMeta = getBlogMeta({
        title: `${
          post.title || "Untitled Blog Post on BestCodes Official Website"
        }`,
        description: post.description || "A blog post by BestCodes",
        url: `/blog/${slug}`,
        image: post?.image,
        tags: post.tags,
      });

      return {
        ...blogMeta,
        robots: {
          index: false,
          follow: false,
          noarchive: true,
          nosnippet: true,
          noimageindex: true,
        },
      };
    }

    const post = getPostBySlug(slug, [
      "title",
      "description",
      "image",
      "tags",
    ]) as PostMeta;

    return getBlogMeta({
      title: `${
        post.title || "Untitled Blog Post on BestCodes Official Website"
      }`,
      description: post.description || "A blog post by BestCodes",
      url: `/blog/${slug}`,
      image: post?.image,
      tags: post.tags,
    });
  } catch (error) {
    return {
      title: "Post Not Found | BestCodes Blog",
      description:
        "The requested blog post could not be found due to an error.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");

  if (isUnpublishedPost(slug)) {
    const isAuthorized = await isAuthorizedForUnpublished();
    if (!isAuthorized) {
      return <UnpublishedAuth slug={slug} />;
    }
  }

  let post: PostMeta;
  let headerImage: any = null;
  try {
    const exists = doesSlugExist(slug);
    if (!exists) {
      return notFound();
    }

    post = getPostBySlug(slug, [
      "content",
      "title",
      "date",
      "author",
      "image",
      "tags",
      "description",
    ]) as PostMeta;

    if (post.image && post.image.url && !post.image.external) {
      try {
        const imagePath = post.image.url;
        const relativePath = "public";
        headerImage = await getDynamicImageAsStatic(imagePath, relativePath);
      } catch (error) {
        console.error("Error processing image:", error);
        headerImage = post.image.url;
      }
    } else if (post.image && post.image.url) {
      headerImage = post.image.url;
    }
  } catch (error) {
    console.error("Error:", error);
    return notFound();
  }

  const highlighter = await shikiHighlighter;

  const formattedCreatedDate = new Date(post.date.created).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  let formattedUpdatedDate;
  if (post.date?.updated) {
    formattedUpdatedDate = new Date(post.date?.updated).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  }

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
                alt={
                  sanitizeHtml(post?.image?.alt) ||
                  `${sanitizeHtml(post.title)} header image`
                }
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
                <h1 className="text-primary mb-2">
                  {sanitizeHtml(post.title)}
                </h1>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
                  <span>{sanitizeHtml(post.author.name || "BestCodes")}</span>
                  <span className="mx-0 hidden sm:mx-1 sm:block">&middot;</span>
                  <div className="flex flex-row">
                    <time dateTime={post.date.created}>
                      {formattedCreatedDate}
                    </time>
                    {formattedUpdatedDate && (
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
                              {formattedUpdatedDate}
                            </time>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                <div className="flex flex-row flex-wrap w-full sm:w-fit justify-between sm:justify-center items-center gap-2">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="default">
                          {sanitizeHtml(tag)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-row gap-2">
                    <PostMetrics slug={slug} />
                    <Button
                      asChild
                      variant="default"
                      size="icon"
                      className="size-6"
                    >
                      <Link href="#page_comments">
                        <MessagesSquare />
                      </Link>
                    </Button>
                  </div>
                </div>
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
                        highlighter,
                        {
                          themes: {
                            "light-retro": "light-plus",
                            "dark-retro": "dark-plus",
                            light: "light-plus",
                            dark: "dark-plus",
                          },
                        } as RehypeShikiCoreOptions,
                      ],
                    ],
                  },
                }}
              />
            </div>
          </div>
        </article>

        {slug && (
          <div
            className="mt-2 sm:mt-6 flex flex-col w-full border-primary border-1 rounded-md p-2 sm:p-6 bg-secondary"
            id="page_comments"
          >
            <div className="flex flex-row justify-between items-center mb-4">
              <h2 className="text-3xl text-primary font-bold">Comments</h2>
              <Button
                asChild
                size="sm"
                variant="default"
                className="not-sm:size-8"
              >
                <Link href="#top">
                  <ArrowUp />
                  <span className="sr-only sm:not-sr-only">Scroll to top</span>
                </Link>
              </Button>
            </div>
            <CommentsWidget
              page={`blog-comments_${slug}`}
              signInRedirectUrl={`/blog/${slug}#page_comments`}
            />
          </div>
        )}

        <div className="mt-2 sm:mt-6 flex justify-between items-center">
          <BackButton defaultHref="/blog" />
        </div>
      </div>
    </main>
  );
}
