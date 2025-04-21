"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DevToEmbedProps {
  id: string | number;
  width: "full" | "default";
  layout: "center" | "left" | "right";
}

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  cover_image: string | null;
  tag_list: string;
  tags: string[];
  user: {
    name: string;
    username: string;
    profile_image_90: string;
  };
}

const DevToEmbed: React.FC<DevToEmbedProps> = ({
  id,
  width = "default",
  layout = "left",
}) => {
  const [data, setData] = useState<DevToArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://dev.to/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load article.");
        setLoading(false);
      });
  }, [id]);

  const Container = ({ children }: { children: React.ReactNode }) => (
    <div
      className={cn(
        "not-prose bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-700 p-4 flex flex-col text-white font-inherit gap-2",
        {
          "w-full": width === "full",
          "max-w-md": width === "default",
          "mx-auto": layout === "center",
          "ml-auto": layout === "right",
          "mr-auto": layout === "left",
        }
      )}
    >
      {children}
    </div>
  );

  if (loading) {
    return (
      <Container>
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex gap-2 mt-0.5">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container>
        <div className="flex items-center justify-center h-72 text-red-400 italic">
          {error || "Article not found."}
        </div>
      </Container>
    );
  }

  const title = data.title;
  const author = data.user.name;
  const date = data.readable_publish_date;
  const tags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tag_list === "string"
    ? data.tag_list.split(",")
    : [];

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline"
    >
      <Container>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
            {data.user.profile_image_90 ? (
              <Image
                src={data.user.profile_image_90}
                alt={author}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              author.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight text-foreground">
              {title}
            </h3>
            <div className="text-muted-foreground text-sm mt-0.5">
              {author} &middot; {date}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <Badge variant="secondary" key={tag.trim()}>
              #{tag.trim()}
            </Badge>
          ))}
        </div>
      </Container>
    </a>
  );
};

export default DevToEmbed;
