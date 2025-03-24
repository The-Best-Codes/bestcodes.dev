import { ProjectCard } from "./card";

function ProjectGrid() {
  const projects = [
    {
      title: "Portfolio Website",
      description:
        "A modern portfolio website built with React and TypeScript, featuring smooth animations and responsive design.",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com",
      demoUrl: "https://demo.com",
      lastUpdated: "Updated 2 days ago",
      status: "completed" as const,
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application.",
      imageUrl:
        "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1000",
      technologies: ["React", "Node.js", "MongoDB"],
      githubUrl: "https://github.com",
      lastUpdated: "Updated 1 week ago",
      status: "in-progress" as const,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectGrid;
