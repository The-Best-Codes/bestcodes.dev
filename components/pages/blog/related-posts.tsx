import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  tags?: string[];
}

interface RelatedPostsProps {
  currentSlug: string;
  tags?: string[];
  limit?: number;
}

export default function RelatedPosts({ currentSlug, tags = [], limit = 3 }: RelatedPostsProps) {
  // Get all posts
  const postsDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(postsDir);
  
  const allPosts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(postsDir, file);
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        image: data.image || '/image/best_codes_logo_low_res.png',
        tags: data.tags || [],
      };
    });
  
  // Filter out current post and find related posts by tags
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug);
  
  // Score posts by number of matching tags
  const scoredPosts = otherPosts.map(post => {
    const matchingTags = post.tags.filter((tag: string) => tags.includes(tag));
    return {
      ...post,
      score: matchingTags.length,
    };
  });
  
  // Sort by score (most matching tags first) and then by date
  const relatedPosts = scoredPosts
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
  
  if (relatedPosts.length === 0) return null;
  
  return (
    <div className="mt-8 pt-8 border-t border-primary/30">
      <h3 className="text-2xl font-semibold text-primary mb-4">Related Posts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {relatedPosts.map(post => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="block bg-secondary/50 border border-primary/30 rounded-md overflow-hidden hover:border-primary transition-all duration-300"
          >
            <div className="h-32 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h4 className="font-medium text-foreground line-clamp-2">{post.title}</h4>
              <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
