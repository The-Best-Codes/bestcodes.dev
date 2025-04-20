import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface PostParams {
  params: Promise<{ post: string }>;
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const { post } = await params;
  const filePath = path.join(process.cwd(), 'content', `${post}.mdx`);
  if (!fs.existsSync(filePath)) return {};
  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev"}`),
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://bestcodes.dev/blog/post/${post}`,
      images: [
        {
          url: data.image || '/image/best_codes_logo_low_res.png',
          width: 800,
          height: 600,
          alt: data.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.image || '/image/best_codes_logo_low_res.png'],
    },
  };
}

export default async function BlogPostPage({ params }: PostParams) {
  const { post } = await params;
  const filePath = path.join(process.cwd(), 'content', `${post}.mdx`);
  if (!fs.existsSync(filePath)) return notFound();
  const { content, data } = matter(fs.readFileSync(filePath, 'utf-8'));

  return (
    <main className="max-w-3xl mx-auto p-6">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
          <time className="block text-gray-500 mb-4" dateTime={data.date}>{data.date}</time>
          <p className="text-lg text-gray-700 mb-2">{data.description}</p>
          {data.image && (
            <img
              src={data.image}
              alt={data.title}
              className="rounded-lg w-full max-h-96 object-cover mb-6"
              width={800}
              height={400}
            />
          )}
        </header>
        <section className="prose prose-lg dark:prose-invert">
          <MDXRemote source={content} />
        </section>
      </article>
    </main>
  );
}
