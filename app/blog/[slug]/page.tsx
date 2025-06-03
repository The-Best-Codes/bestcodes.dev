import { BackButton } from "@/components/blog/back-button";
import { components as mdxComponents } from "@/components/blog/mdx-components";
import { CommentsWidget } from "@/components/comments";
import { Badge } from "@/components/ui/badge";
import { doesSlugExist } from "@/lib/blog/doesPostExist";
import { getPostBySlug, getPostSlugs, PostMeta } from "@/lib/blog/getData";
import { JsonLd } from "@/lib/blog/json-ld";
import getDynamicImageAsStatic from "@/lib/getImageDynamic";
import { getBlogMeta } from "@/lib/getMeta";
import shikiHighlighter from "@/lib/shiki";
import { sanitizeHtml } from "@/lib/utils";
import type { RehypeShikiCoreOptions } from "@shikijs/rehype/core";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

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
  const { slug } = await params;

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

  const formattedDate = new Date(post.date.created).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <main
      role="main"
      className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center p-2 sm:p-12 pt-2 sm:pt-4"
    >
      <JsonLd key={`json-ld-blog-${slug}`} post={post} slug={slug} />
      <div className="max-w-4xl w-full">
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
                width={post.image.external ? 896 : undefined}
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
            <header className="mb-8 border-b border-primary pb-2 sm:pb-6">
              <div className="max-w-none prose prose-sm sm:text-base md:text-lg">
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

            <div className="prose prose-sm text-lg dark:prose-invert max-w-none prose-headings:text-primary prose-headings:mb-0 prose-a:text-primary prose-img:rounded-md prose-quoteless">
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
                          theme: "dark-plus",
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
            className="mt-2 sm:mt-6 flex flex-col w-full border-primary border-1 rounded-md p-2 sm:p-6 bg-secondary viewport-scroll-middle"
            id="page_comments"
          >
            <h2 className="text-3xl text-primary font-bold mb-4">Comments</h2>
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
