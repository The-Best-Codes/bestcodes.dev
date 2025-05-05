import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  isMobile: boolean;
  pathname: string;
}

export function NavItems({ isMobile, pathname }: NavItemsProps) {
  return (
    <ul className={`flex ${isMobile ? "flex-col space-y-4" : "space-x-4"}`}>
      <li>
        <Link
          href="/"
          className={cn(
            "text-foreground text-2xl hover:text-primary hover:underline",
            {
              underline: pathname === "/",
            },
          )}
          aria-label="Home page"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/blog"
          className={cn(
            "text-foreground text-2xl hover:text-primary hover:underline",
            {
              underline: pathname === "/blog",
            },
          )}
          aria-label="Blog articles"
        >
          Blog
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          className={cn(
            "text-foreground text-2xl hover:text-primary hover:underline",
            {
              underline: pathname === "/contact",
            },
          )}
          aria-label="Contact page"
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}
