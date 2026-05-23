import getMeta from "@/lib/getMeta";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = getMeta(
  "Hire Tim SF - BestCodes",
  "My friend Tim has a really cool website - hiretimsf.com. Check it out!",
  "/hire-tim-sf",
);

export default async function Page() {
  return (
    <main
      role="main"
      className="flex p-6 min-h-screen-hf scroll-smooth max-w-screen w-full flex-col items-center justify-center"
    >
      <article className="prose dark:prose-invert max-w-2xl">
        <h1>Hire Tim in SF</h1>
        <p>
          My friend Tim has a really cool website over at{" "}
          <a href="https://hiretimsf.com/" target="_blank" rel="dofollow">
            hiretimsf.com
          </a>
          . I&apos;ve been keeping an eye on his work for a while and I think
          he&apos;s awesome at what he does. Just look at that amazing website
          😄
        </p>
        <p>
          If you&apos;re looking for someone talented, reliable, and great to
          work with, I highly recommend you{" "}
          <a
            href="https://hiretimsf.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            check out his website
          </a>{" "}
          and consider hiring him. He&apos;s based in San Francisco and brings a
          lot of passion to his work.
        </p>
        <p>
          Go give him some love -{" "}
          <a
            href="https://hiretimsf.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            hiretimsf.com
          </a>
        </p>
      </article>
    </main>
  );
}
