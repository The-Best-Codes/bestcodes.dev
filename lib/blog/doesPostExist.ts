import cachedSlugs from "../../.blog-cache/slugs.json";

export function doesSlugExist(slug: string): boolean {
  const exists = cachedSlugs.includes(slug);
  return exists;
}
