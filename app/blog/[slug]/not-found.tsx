import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center">
      <section 
        id="not-found"
        aria-label="Blog Post Not Found"
        className="w-full p-6 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-4xl w-full bg-secondary border border-primary p-6 rounded-md text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            404 - Post Not Found
          </h1>
          <p className="text-lg text-foreground mb-6">
            Sorry, the blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center bg-primary text-background px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
