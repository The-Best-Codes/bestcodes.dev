import { getAllPosts, PostMeta } from "@/lib/blog/getData";

export function getLatestPosts(count: number = 4): PostMeta[] {
  const posts = getAllPosts([
    "slug",
    "title",
    "date",
    "description",
    "image",
    "author",
    "tags",
  ]) as PostMeta[];

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    return (
      new Date(b.date.created).getTime() - new Date(a.date.created).getTime()
    );
  });

  // Return only the requested number of posts
  return sortedPosts.slice(0, count);
}
