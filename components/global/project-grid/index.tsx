"use client";
import { useState } from "react";
import { ProjectCard } from "./card";
import { projectsData as projects } from "./project-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ProjectGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;

  // Calculate total pages
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  // Change page
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <Button
            size="sm"
            variant="default"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </Button>

          <div className="text-sm">
            <span className="sr-only sm:not-sr-only">Page</span> {currentPage}{" "}
            of {totalPages}
          </div>

          <Button
            size="sm"
            variant="default"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProjectGrid;
