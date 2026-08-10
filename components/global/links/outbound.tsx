import Link, { LinkProps } from "next/link";
import React, { forwardRef } from "react";

export interface OutboundLinkProps
  extends
    Omit<LinkProps, "href">,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const OutboundLink = forwardRef<HTMLAnchorElement, OutboundLinkProps>(
  ({ href, children, rel, ...props }, ref) => {
    const isExternal = /^https?:\/\//i.test(href);
    const linkRel = isExternal
      ? ["external", "noopener", "noreferrer", rel].filter(Boolean).join(" ")
      : rel;

    return (
      <Link
        prefetch={false}
        href={href}
        rel={linkRel}
        {...props}
        ref={ref as any}
      >
        {children}
      </Link>
    );
  },
);

OutboundLink.displayName = "OutboundLink";

export default OutboundLink;
