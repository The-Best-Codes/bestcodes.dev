import Link, { LinkProps } from "next/link";
import React, { forwardRef } from "react";

export interface OutboundLinkProps
  extends Omit<LinkProps, "href">,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const OutboundLink = forwardRef<HTMLAnchorElement, OutboundLinkProps>(
  ({ href, children, ...props }, ref) => {
    let outboundHref: string;
    try {
      if (href.startsWith("http")) {
        outboundHref = `/api/link/outbound?url=${encodeURIComponent(href)}`;
      } else {
        outboundHref = href;
      }
    } catch (error) {
      console.error("Error encoding URL:", error);
      return (
        <Link prefetch={false} href={href} {...props} ref={ref as any}>
          {children}
        </Link>
      );
    }

    return (
      <Link prefetch={false} href={outboundHref} {...props} ref={ref as any}>
        {children}
      </Link>
    );
  },
);

OutboundLink.displayName = "OutboundLink";

export default OutboundLink;
