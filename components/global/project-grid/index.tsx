"use client";
import OutboundLink from "@/components/global/links/outbound";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "./card";
import { projectsData as projects } from "./project-data";

function ProjectGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <section
      id="projects"
      aria-label="Best Codes' Projects"
      className="w-full p-2 pt-0 sm:pt-0 sm:p-12 flex flex-col justify-center items-center relative"
    >
      <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
        {totalPages > 1 && (
          <div className="flex max-w-5xl justify-end items-center w-full gap-0 sticky top-1/2 right-4 z-40">
            <div className="w-fit bg-background p-2 rounded-md">
              <Button
                size="icon"
                variant="default"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="rounded-tr-none rounded-br-none w-8 h-8"
              >
                <ChevronLeft />
                <span className="sr-only select-none">Previous</span>
              </Button>
              <Button
                size="icon"
                variant="default"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="rounded-tl-none rounded-bl-none w-8 h-8"
              >
                <span className="sr-only select-none">Next</span>
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
        <div className="-mt-12">
          <h3 className="text-3xl text-foreground mb-6">Projects</h3>
          <article id="projects:-:desc">
            <p className="text-lg text-foreground">
              These are just a few of my projects. To see more of them, you
              should visit my{" "}
              <OutboundLink
                target="_blank"
                href="https://github.com/The-Best-Codes"
                className="text-primary"
              >
                GitHub profile!
              </OutboundLink>
            </p>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="max-w-6xl mx-auto mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentProjects.map((project, index) => (
                    <ProjectCard
                      key={`project-${index}-${project.title}`}
                      {...project}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ProjectGrid;
