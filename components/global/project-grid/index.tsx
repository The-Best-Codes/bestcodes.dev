import { ProjectCard } from "./card";

function ProjectGrid() {
  const projects = [
    {
      title: "Best-Bible JS",
      description:
        "Allows developers to parse and analyze the Bible easily in their applications.",
      imageUrl: "/image/projects/best-bible-js-logo.png",
      technologies: ["TypeScript", "Bun"],
      githubUrl: "https://github.com/The-Best-Codes/best-bible",
      status: "completed" as const,
    },
    {
      title: "Discraft",
      description:
        "The best framework for building Discord bots. Powerful and easy to use, with built-in command and event handling, serverless deployment options, and more.",
      imageUrl: "/image/projects/discraft-js-logo.png",
      technologies: ["TypeScript", "Node.js", "Serverless"],
      githubUrl: "https://github.com/The-Best-Codes/discraft-js",
      demoUrl:
        "https://dev.to/best_codes/make-a-free-ai-chatbot-with-discord-vercel-373l",
      status: "completed" as const,
    },
    {
      title: "CodeQuill",
      description:
        "Organize, edit, and preview code efficiently. CodeQuill is a desktop application built with Tauri that makes it easy to save and preview code snippets.",
      imageUrl: "/image/projects/codequill-logo.png",
      technologies: ["TypeScript", "Tauri", "Rust"],
      githubUrl: "https://github.com/The-Best-Codes/codequill",
      demoUrl: "https://snapcraft.io/codequill",
      status: "completed" as const,
    },
    {
      title: "WordWorks API",
      description:
        "The WordWorks API makes it easy for developers to use NLP as a service to analyze the sentiment and parts of speech in text.",
      imageUrl: "/image/projects/wordworks-api-logo.png",
      technologies: ["Next.js", "NLP", "Vercel"],
      githubUrl: "https://github.com/The-Best-Codes/wordworks-api",
      demoUrl: "https://wordworks-api.vercel.app/",
      status: "completed" as const,
    },
    {
      title: "Best-Holiday",
      description:
        "Best-Holiday is a JS library that makes it easy to get data about holidays.",
      imageUrl: "/image/projects/best-holiday-logo.png",
      technologies: ["TypeScript", "JavaScript", "ESBuild"],
      githubUrl: "https://github.com/The-Best-Codes/best-holiday",
      status: "completed" as const,
    },
    {
      title: "Chatter",
      description: "Chatter is a simple, fast, & local chat app",
      imageUrl: "/image/projects/chatter-logo.png",
      technologies: ["TypeScript", "Bun", "WebSockets"],
      githubUrl: "https://github.com/The-Best-Codes/chatter",
      status: "completed" as const,
    },
    {
      title: "Developer Icons",
      description:
        "A collection of well-optimized SVG tech logos for developers and designers — customizable, scalable, and free.",
      imageUrl: "/image/projects/developer-icons-cover.png",
      technologies: ["Astro", "TypeScript", "SVG"],
      githubUrl: "https://github.com/The-Best-Codes/developer-icons",
      demoUrl: "https://xandemon.github.io/developer-icons/",
      status: "contributed" as const,
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
