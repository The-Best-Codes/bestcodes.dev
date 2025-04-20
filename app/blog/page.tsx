import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev"}`),
  title: 'Blog | BestCodes Official Website',
  description: 'Read insightful posts on web development, coding, and tech by BestCodes.',
  openGraph: {
    title: 'Blog | BestCodes Official Website',
    description: 'Read insightful posts on web development, coding, and tech by BestCodes.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev"}/blog`,
    siteName: "BestCodes' Blog | BestCodes Official Website",
    images: [
      {
        url: '/image/best_codes_logo_low_res.png',
        width: 800,
        height: 600,
        alt: 'BestCodes Logo',
      },
    ],
    type: 'website',
  },
};

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
}

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(postsDir);
  return files.filter(f => f.endsWith('.mdx')).map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(postsDir, file);
    const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      description: data.description || '',
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export default function BlogPage() {
  const posts = getPosts();
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug} className="mb-8">
            <article>
              <h2 className="text-2xl font-semibold mb-1">
                <Link href={`/blog/post/${post.slug}`}>{post.title}</Link>
              </h2>
              <time className="block text-gray-500 mb-2" dateTime={post.date}>{post.date}</time>
              <p className="text-lg text-gray-700 mb-1">{post.description}</p>
              <Link className="text-primary underline" href={`/blog/post/${post.slug}`}>Read more →</Link>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
