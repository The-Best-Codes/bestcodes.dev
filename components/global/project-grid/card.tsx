import OutboundLink from "@/components/global/links/outbound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { ProjectCardProps, ProjectStatus } from "./types";

type BadgeVariant = "default" | "secondary" | "destructive";

const statusConfig: Record<
  ProjectStatus,
  { variant: BadgeVariant; label: string }
> = {
  "in-progress": {
    variant: "secondary",
    label: "In Progress",
  },
  completed: {
    variant: "default",
    label: "Completed",
  },
  contributed: {
    variant: "secondary",
    label: "Contributed",
  },
  planned: {
    variant: "secondary",
    label: "Planned",
  },
  archived: {
    variant: "destructive",
    label: "Archived",
  },
};

export function ProjectCard({
  title,
  description,
  imageUrl,
  technologies,
  githubUrl,
  demoUrl,
  status,
}: ProjectCardProps) {
  return (
    <div className="max-w-md w-full bg-background rounded-md overflow-hidden focus-within:ring focus-within:ring-primary flex flex-col h-full">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${title} Preview Blurred Background`}
            fill
            quality={10}
            priority={false}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw"
            className="opacity-70 object-cover object-center scale-150 blur-lg"
          />
        </div>

        <div className="h-48 w-full relative z-10 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={`${title} Preview`}
            width={448}
            height={192}
            quality={25}
            className="max-h-full max-w-full object-contain"
            style={{ width: "auto", height: "auto", maxHeight: "12rem" }}
          />
        </div>
        {status && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant={statusConfig[status].variant}>
              {statusConfig[status].label}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <OutboundLink
            aria-disabled={!demoUrl && !githubUrl}
            aria-label={`Primary link for ${title}`}
            href={demoUrl || githubUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-2xl font-bold text-primary hover:underline mb-2">
              {title}
            </h2>
          </OutboundLink>
          <p className="text-foreground max-h-40 overflow-auto mb-4">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map((tech, index) => (
              <Badge key={index}>{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-primary mt-auto">
          <div className="flex space-x-2">
            {githubUrl && (
              <Button variant="outline" asChild>
                <OutboundLink
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code />
                  <span>Code</span>
                </OutboundLink>
              </Button>
            )}
            {demoUrl && (
              <Button variant="outline" asChild>
                <OutboundLink
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                  <span>Website</span>
                </OutboundLink>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
