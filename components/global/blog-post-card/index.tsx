import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostMeta } from "@/lib/blog/getData";
import { getImageBlurURL } from "@/lib/getImageDynamic";
import { cn, sanitizeHtml } from "@/lib/utils";
import { escape } from "lodash";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function BlogPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="w-full bg-background rounded-md overflow-hidden focus-within:ring focus-within:ring-primary flex flex-col h-full">
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
                src={await getImageBlurURL(`public/${post.image.url}`)}
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
            <h2 className="text-2xl font-bold mb-2 inline">
              {sanitizeHtml(post.title)}
            </h2>
          </Link>

          <div hidden aria-hidden="true" className="flex flex-wrap gap-2 mb-4">
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
            <span className="mx-0 hidden sm:mx-1 sm:block">&middot;</span>
            <time dateTime={post.date.created}>
              {new Date(post.date.created).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
          <Button variant="link" size="sm" className="text-sm h-fit" asChild>
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
  );
}
