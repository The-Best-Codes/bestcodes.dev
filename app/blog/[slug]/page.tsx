import getMeta from "@/lib/getMeta";
import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";

interface PostParams {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "content");
  const files = fs.readdirSync(postsDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));
}

export async function generateMetadata({
  params,
}: PostParams): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return getMeta(
      "Post Not Found | BestCodes Blog",
      "The requested blog post could not be found.",
      `/blog/${slug}`,
    );
  }

  const { data } = matter(fs.readFileSync(filePath, "utf-8"));

  return getMeta(
    `${data.title || "Untitled Blog Post on BestCodes Official Website"}`,
    data.description || "A blog post by BestCodes",
    `/blog/${slug}`,
  );
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), `content/${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const { content, data } = matter(fs.readFileSync(filePath, "utf-8"));
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center">
      <section
        id="blog-post-header"
        aria-label="Blog Post Header"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-4xl w-full">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <span className="mr-1">←</span> Back to all posts
          </Link>

          {data.image && (
            <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg mb-6">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-secondary border border-primary p-6 rounded-md">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
              {data.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-foreground/70 mb-4">
              <span>{data.author || "BestCodes"}</span>
              <span className="mx-2">&middot;</span>
              <time dateTime={data.date}>{formattedDate}</time>

              {data.tags && data.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-primary/20 text-primary px-2 py-1 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {data.description && (
              <p className="text-lg text-foreground italic border-l-4 border-primary pl-4 py-2 bg-primary/5">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        id="blog-post-content"
        aria-label="Blog Post Content"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <article className="max-w-4xl w-full bg-secondary border border-primary p-6 rounded-md">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground/90 prose-code:text-primary prose-code:bg-primary/10 prose-code:p-1 prose-code:rounded-md">
            <MDXRemote source={content} />
          </div>
        </article>
      </section>

      <section
        id="blog-post-footer"
        aria-label="Blog Post Footer"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-4xl w-full">
          <div className="flex justify-between items-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary hover:underline"
            >
              <span className="mr-1">←</span> Back to all posts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
