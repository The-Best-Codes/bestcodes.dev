import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { z } from "zod";

const PostMetaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.object({
    created: z.string().min(1, "Created date is required"),
    updated: z.string().optional(),
  }),
  description: z.string().optional(),
  author: z.object({
    name: z.string().min(1, "Author name is required"),
  }),
  image: z
    .object({
      url: z.string(),
      alt: z.string().optional(),
      external: z.boolean().optional(),
      fit: z.enum(["cover", "contain"]).optional(),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
});

export type PostMeta = z.infer<typeof PostMetaSchema> & {
  description: string;
  content: string;
  slug: string;
};

const postsDir = path.join(process.cwd(), "content");

// Unpublished posts are only visible in development.
const includeUnpublished = process.env.NODE_ENV === "development";

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDir, { recursive: true, encoding: "utf-8" })
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, "").replace(/\\/g, "/"))
    .filter((slug) => includeUnpublished || !slug.startsWith("unpublished/"));
}

export function getPostBySlug(slug: string): PostMeta | null {
  if (!getPostSlugs().includes(slug)) return null;

  const { data, content } = matter(
    fs.readFileSync(path.join(postsDir, `${slug}.mdx`), "utf-8"),
  );
  const meta = PostMetaSchema.parse(data);

  return {
    ...meta,
    description: meta.description || `${content.substring(0, 150)}...`,
    content,
    slug,
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map(getPostBySlug)
    .filter((post): post is PostMeta => post !== null)
    .sort(
      (a, b) =>
        new Date(b.date.created).getTime() - new Date(a.date.created).getTime(),
    );
}
