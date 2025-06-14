export type ProjectStatus =
  | "in-progress"
  | "completed"
  | "contributed"
  | "planned"
  | "archived";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  status?: ProjectStatus;
  isHidden?: boolean;
}
