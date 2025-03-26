import { ProjectCard } from "./card";
import { projectsData as projects } from "./project-data";

function ProjectGrid() {
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
