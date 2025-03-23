import Link from "next/link";

interface NavItemsProps {
  isMobile: boolean;
}

export function NavItems({ isMobile }: NavItemsProps) {
  return (
    <ul className={`flex ${isMobile ? "flex-col space-y-4" : "space-x-4"}`}>
      <li>
        <Link
          prefetch={true}
          href="/"
          className="text-black text-2xl hover:text-blue-500"
          aria-label="Home page"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          prefetch={true}
          href="https://dev.to/best_codes"
          className="text-black text-2xl hover:text-blue-500"
          aria-label="Blog articles"
        >
          Blog
        </Link>
      </li>
      <li>
        <Link
          prefetch={true}
          href="/contact"
          className="text-black text-2xl hover:text-blue-500"
          aria-label="Contact page"
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}
