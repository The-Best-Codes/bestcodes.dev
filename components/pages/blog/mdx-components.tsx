import OutboundLink from "@/components/global/links/outbound";
import Link from "next/link";
import React from "react";

interface CalloutProps {
  type?: "info" | "warning" | "success" | "error";
  children: React.ReactNode;
}

const Callout = ({ type = "info", children }: CalloutProps) => {
  const styles = {
    info: "bg-blue-500/10 border-blue-500 text-blue-700",
    warning: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
    success: "bg-green-500/10 border-green-500 text-green-700",
    error: "bg-red-500/10 border-red-500 text-red-700",
  };

  const icons = {
    info: "💡",
    warning: "⚠️",
    success: "✅",
    error: "❌",
  };

  return (
    <div className={`p-4 my-6 border-l-4 rounded-r-md ${styles[type]}`}>
      <div className="flex items-start">
        <span className="mr-2 text-xl">{icons[type]}</span>
        <div>{children}</div>
      </div>
    </div>
  );
};

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const language = className?.replace("language-", "") || "text";

  return (
    <div className="relative group">
      <div className="absolute top-0 right-0 bg-primary/20 text-primary text-xs px-2 py-1 rounded-bl-md">
        {language}
      </div>
      <pre
        className={`${className} overflow-x-auto p-4 rounded-md bg-secondary/80 border border-primary/20`}
      >
        {children}
      </pre>
    </div>
  );
};

interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
}

const Image = ({ src, alt, caption }: ImageProps) => {
  return (
    <figure className="my-8">
      {/* TODO: Replace with next/image */}
      <img src={src} alt={alt} className="w-full rounded-md shadow-md" />
      {caption && (
        <figcaption className="text-center text-sm text-foreground/70 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

const CustomLink = (props: any) => {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        target="_blank"
        {...props}
        className="text-primary hover:underline"
      />
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} className="text-primary hover:underline" />;
  }

  return (
    <OutboundLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
      {...props}
    />
  );
};

export const mdxComponents = {
  a: CustomLink,
  Callout,
  pre: CodeBlock,
  Image,
};

export default mdxComponents;
