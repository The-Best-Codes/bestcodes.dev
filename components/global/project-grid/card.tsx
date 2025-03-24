import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ProjectStatus =
  | "in-progress"
  | "completed"
  | "planned"
  | "archived";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  status?: ProjectStatus;
}

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
        <Image
          src={imageUrl}
          alt={`${title} Preview`}
          width={448}
          height={192}
          className="w-full h-48 object-cover"
        />
        {status && (
          <div className="absolute top-4 right-4">
            <Badge variant={statusConfig[status].variant}>
              {statusConfig[status].label}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
          <p className="text-foreground mb-4">{description}</p>

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
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code />
                  <span>Source</span>
                </Link>
              </Button>
            )}
            {demoUrl && (
              <Button variant="outline" asChild>
                <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  <span>Demo</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
