import React from "react";
import { Github, ExternalLink } from "lucide-react";

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
  lastUpdated: string;
  status?: ProjectStatus;
}

const statusConfig = {
  "in-progress": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "In Progress",
  },
  completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
  planned: { bg: "bg-purple-100", text: "text-purple-700", label: "Planned" },
  archived: { bg: "bg-gray-100", text: "text-gray-700", label: "Archived" },
};

export function ProjectCard({
  title,
  description,
  imageUrl,
  technologies,
  githubUrl,
  demoUrl,
  lastUpdated,
  status,
}: ProjectCardProps) {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col h-full">
      <div className="relative">
        <img
          src={imageUrl}
          alt={`${title} Preview`}
          className="w-full h-48 object-cover"
        />
        {status && (
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}
            >
              {statusConfig[status].label}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <div className="flex space-x-4">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5 mr-1" />
                <span>Source</span>
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-1" />
                <span>Demo</span>
              </a>
            )}
          </div>
          <span className="text-sm text-gray-500">{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
