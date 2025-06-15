import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { z } from "zod";
import { doesSlugExist } from "./doesPostExist";

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
  tags: z.array(z.string()).optional(),
});

export type PostMetaNoContent = z.infer<typeof PostMetaSchema>;
export type PostMeta = PostMetaNoContent & { content: string; slug: string };

interface RawPostMeta {
  title: string;
  date: { created: string; updated?: string }[];
  description?: string;
  author: { name: string }[];
  image?: {
    url: string;
    alt?: string;
    external?: boolean;
    fit?: "cover" | "contain";
  };
  tags?: string[];
}

const postsDir = path.join(process.cwd(), "content");

export function getPostSlugs(): string[] {
  return getPostSlugsRecursive(postsDir, "");
}

function getPostSlugsRecursive(dir: string, relativePath: string): string[] {
  const slugs: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const currentRelativePath = relativePath
      ? path.join(relativePath, item.name)
      : item.name;

    if (item.isDirectory()) {
      // Recursively scan subdirectories
      slugs.push(...getPostSlugsRecursive(fullPath, currentRelativePath));
    } else if (item.isFile() && item.name.endsWith(".mdx")) {
      // Convert file path to slug (remove .mdx extension and normalize path separators)
      const slug = currentRelativePath
        .replace(/\.mdx$/, "")
        .replace(/\\/g, "/");
      slugs.push(slug);
    }
  }

  return slugs;
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const exists = doesSlugExist(slug);
  if (!exists) {
    throw new Error(`Slug ${slug} does not exist`);
  }

  // Handle both nested paths (category/post) and root level posts (post)
  const filePath = path.join(postsDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  if (content === undefined) {
    throw new Error(`Content is undefined for ${slug}.mdx`);
  }

  const parsedData: RawPostMeta = {
    title: data.title,
    date: data.date,
    description: data.description,
    author: data.author,
    image: data.image,
    tags: data.tags,
  };

  try {
    PostMetaSchema.parse(parsedData);
  } catch (error) {
    console.error(`Error validating post metadata for ${slug}.mdx:`, error);
    throw error;
  }

  const items: { [key: string]: any } = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = slug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (field === "title") {
      items[field] = parsedData.title;
    }

    if (field === "date") {
      items[field] = parsedData.date;
    }

    if (field === "description") {
      items[field] =
        parsedData.description || `${content.substring(0, 150)}...`;
    }

    if (field === "author") {
      items[field] = parsedData.author;
    }

    if (field === "image") {
      items[field] = parsedData.image;
    }

    if (field === "tags") {
      items[field] = parsedData.tags || [];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug, fields);
      } catch (error) {
        console.error(`Error getting post by slug ${slug}:`, error);
        return null;
      }
    })
    .filter(Boolean)
    .sort((post1: any, post2: any) =>
      post1.date.created > post2.date.created ? -1 : 1,
    );
  return posts;
}
