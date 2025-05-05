import { BlogPostCard } from "@/components/global/blog-post-card";
import OutboundLink from "@/components/global/links/outbound";
import ProjectGrid from "@/components/global/project-grid";
import MatrixRain from "@/components/pages/matrix-rain";
import OnlineAccounts from "@/components/pages/online-accounts";
import { Button } from "@/components/ui/button";
import { getLatestPosts } from "@/lib/blog/getLatestPosts";
import profileImage from "@/public/image/best_codes_logo_low_res.png";
import { BookText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const latestPosts = getLatestPosts(4);

  return (
    <main
      role="main"
      className="flex min-h-screen-hf scroll-auto max-w-screen w-full flex-col items-center"
    >
      <section
        id="matrix-animation"
        aria-label="Matrix Animation Section with Text Overlay"
        className="w-full h-60 sm:h-80 relative"
      >
        <MatrixRain />
        <div className="absolute top-0 left-0 w-full h-full bg-transparent flex justify-center items-center">
          <span className="text-7xl sm:text-9xl font-bold text-foreground">
            👋 Hi
          </span>
        </div>
      </section>
      <section
        id="hero-section"
        aria-label="Developer logo and tagline hero section"
        className="w-full p-2 sm:p-12 flex flex-col justify-center items-center text-center"
      >
        <Image
          src={profileImage}
          alt="Best Codes Logo"
          aria-label="Best Codes letter 'B' logo"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
          placeholder="blur"
        />
        <h1 className="text-5xl md:text-8xl mt-4 font-bold text-primary">
          I&apos;m BestCodes
        </h1>
        <h2
          aria-label="Best Codes is a Christian, Coder, and Creator"
          className="text-3xl md:text-5xl text-primary"
        >
          Christian, Coder, Creator
        </h2>
      </section>
      <section
        id="about-me"
        aria-label="About Best Codes (Me)"
        className="w-full p-2 pt-0 sm:pt-0 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <h3 className="text-3xl text-foreground mb-6">About Me</h3>
          <article id="about-me:-:christian">
            <h4 className="text-2xl text-foreground">
              I&apos;m a <span className="text-primary">Christian</span>
            </h4>
            <p className="text-lg text-foreground">
              I&apos;m a sinner saved by grace, redeemed by Christ&apos;s love.
              Striving to live for God&apos;s glory and share His message of
              hope. Imperfect but forgiven, growing in faith daily.
            </p>
            <p className="text-lg text-foreground">
              I haven&apos;t published very many of my Christian or Bible
              related projects yet. (I haven&apos;t published many of my
              projects in general). I am currently working on a few Bible apps,
              verse of the day programs, etc. I&apos;ll publish them when I get
              around to finishing them&hellip;
            </p>
          </article>
          <article id="about-me:-:coder" className="mt-4">
            <h4 className="text-2xl text-foreground">
              I&apos;m a <span className="text-primary">Coder</span>
            </h4>
            <p className="text-lg text-foreground">
              I love to code! I&apos;ve been coding for about{" "}
              {new Date().getFullYear() - 2017} years now.
            </p>
            <p className="text-lg text-foreground">
              My programming journey began several years ago when I received an{" "}
              <OutboundLink
                className="text-primary"
                target="_blank"
                href="https://i.refs.cc/xAR8lRPv?smile_ref=eyJzbWlsZV9zb3VyY2UiOiJzbWlsZV91aSIsInNtaWxlX21lZGl1bSI6IiIsInNtaWxlX2NhbXBhaWduIjoicmVmZXJyYWxfcHJvZ3JhbSIsInNtaWxlX2N1c3RvbWVyX2lkIjoyMDI0OTI5ODg0fQ%3D%3D"
              >
                mBot
              </OutboundLink>{" "}
              from a friend. The little robot was simple but very fun! The
              graphic-based programming (based on Blockly by Google) made it
              pretty easy to learn and understand coding concepts. Of course,
              it&apos;s very limited! I wanted to learn more. You run out of
              things to do with Blockly quite quickly.
            </p>
            <p className="text-lg text-foreground">
              Before receiving my mBot, I had already fiddled with JavaScript a
              bit. I made a few simple HTML pages (the typical &quot;Hello
              World&quot; 🤪). It was super fun but also super impractical! I
              wanted to make my own useful website. Interactivity isn&apos;t
              everything!
            </p>
            <p className="text-lg text-foreground">
              It didn&apos;t take long for me to discover CSS. I fine-tuned my
              styling skills with the help of AI. (Now, of course, I just use
              frameworks with built in styling like TailwindCSS. It makes things
              a lot more uniform and consistent.)
            </p>
            <p className="text-lg text-foreground">
              That&apos;s a nice summary of how I got started with web
              development. I&apos;m a full-stack developer now, which, for any
              non-programming viewers, basically means I make the frontend
              things you appreciate (a website is frontend), and the backend
              things you probably don&apos;t care about. There&apos;s a lot that
              goes on behind the scenes!
            </p>
            <p className="text-lg text-foreground">
              I write most of my backend in Node.js or TypeScript with{" "}
              <OutboundLink
                href="https://bun.sh/"
                target="_blank"
                className="text-primary"
              >
                Bun
              </OutboundLink>
              , which is not surprising (since I already had experience with
              JavaScript.)
            </p>
          </article>
          <article id="about-me:-:creator" className="mt-4">
            <h4 className="text-2xl text-foreground">
              I&apos;m a <span className="text-primary">Creator</span>
            </h4>
            <p className="text-lg text-foreground">
              I design stuff. I create stuff. I{" "}
              <OutboundLink
                href="https://makerworld.com/en/@Best_codes"
                target="_blank"
                className="text-primary"
              >
                3D print stuff.
              </OutboundLink>
            </p>
            <p className="text-lg text-foreground">
              Once upon a time, I received a challenge &mdash; if I could learn
              to 3D design, the challenger would gift me a free 3D Printer.
            </p>
            <p className="text-lg text-foreground">
              How could I turn that down? I got right to work. I began 3D
              modeling with Blender, which wasn&apos;t the easiest thing to
              start with. Blender targets 3D animation and film production, but
              thankfully there are plenty of tutorials on YouTube.
            </p>
            <p className="text-lg text-foreground">
              I usually use OnShape (a CAD software), but I&apos;m learning a
              bit more mesh modeling and other softwares.
            </p>
          </article>
        </div>
      </section>
      <section
        id="find-me"
        aria-label="Where to find Best Codes online"
        className="w-full p-2 pt-0 sm:pt-0 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <h3 className="text-3xl text-foreground mb-6">Where to find me</h3>
          <article id="find-me:-:online">
            <p className="text-lg text-foreground">
              I have a lot of online accounts, but these are the best ones to
              reach me at.
            </p>
            <div className="w-full flex flex-col justify-center items-center">
              <OnlineAccounts />
            </div>
          </article>
        </div>
      </section>
      <section
        id="projects"
        aria-label="Best Codes' Projects"
        className="w-full p-2 pt-0 sm:pt-0 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <h3 className="text-3xl text-foreground mb-6">Projects</h3>
          <article id="projects:-:desc">
            <p className="text-lg text-foreground">
              These are just a few of my projects. To see more of them, you
              should visit my{" "}
              <OutboundLink
                target="_blank"
                href="https://github.com/The-Best-Codes"
                className="text-primary"
              >
                GitHub profile!
              </OutboundLink>
            </p>
            <div className="w-full flex flex-col justify-center items-center">
              <ProjectGrid />
            </div>
          </article>
        </div>
      </section>
      <section
        id="latest-posts"
        aria-label="Latest Posts"
        className="w-full p-2 pt-0 sm:pt-0 sm:p-12 flex flex-col justify-center items-center"
      >
        <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl text-foreground">Latest Posts</h3>
            <Button
              className="hidden sm:flex"
              variant="default"
              size="sm"
              asChild
            >
              <Link href="/blog" className="flex items-center gap-2">
                <BookText />
                View all posts
              </Link>
            </Button>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestPosts.map(async (post) => (
                <BlogPostCard
                  key={post.slug}
                  post={post}
                  backButtonUrl="/#latest-posts"
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-secondary border border-primary rounded-md">
              <h2 className="text-2xl text-foreground mb-2">No posts yet</h2>
              <p className="text-foreground/80">
                Check back soon for new content!
              </p>
            </div>
          )}
          <Button
            className="flex sm:hidden mt-6"
            variant="default"
            size="sm"
            asChild
          >
            <Link href="/blog" className="flex items-center gap-2">
              <BookText />
              <div className="flex flex-row gap-[3px]">
                Read more posts
                <span className="max-[25rem]:hidden block">on the blog</span>
              </div>
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
