import OutboundLink from "@/components/global/links/outbound";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DevToEmbedProps {
  id: string | number;
  width?: "full" | "default";
  layout?: "center" | "left" | "right";
}

interface DevToArticle {
  title: string;
  readable_publish_date: string;
  url: string;
  tags: string[];
  user: {
    name: string;
    profile_image_90: string;
  };
}

// Server component: the article is fetched once when the (static) blog post is
// built, so readers never hit the dev.to API.
export default async function DevToEmbed({
  id,
  width = "default",
  layout = "left",
}: DevToEmbedProps) {
  const data: DevToArticle | null = await fetch(
    `https://dev.to/api/articles/${id}`,
    { cache: "force-cache" },
  )
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  const containerClass = cn(
    "not-prose bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-700",
    "flex flex-col text-white font-inherit gap-2",
    {
      "w-full": width === "full",
      "max-w-md": width === "default",
      "mx-auto": layout === "center",
      "ml-auto": layout === "right",
      "mr-auto": layout === "left",
    },
  );

  if (!data) {
    return (
      <div className={cn(containerClass, "p-4")}>
        <div className="flex items-center justify-center h-20 text-red-400 italic">
          Article not found.
        </div>
      </div>
    );
  }

  const author = data.user.name;

  return (
    <div className={containerClass}>
      <OutboundLink target="_blank" className="w-full p-4" href={data.url}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
            {data.user.profile_image_90 ? (
              <Image
                src={data.user.profile_image_90}
                alt={author}
                width={48}
                height={48}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              author.charAt(0)
            )}
          </div>
          <div>
            <span className="text-xl font-bold leading-tight text-foreground">
              {data.title}
            </span>
            <div className="text-muted-foreground text-sm mt-0.5">
              {author} &middot; {data.readable_publish_date}
            </div>
          </div>
        </div>

        {data.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.tags.map((tag) => (
              <Badge variant="secondary" key={tag}>
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </OutboundLink>
    </div>
  );
}
