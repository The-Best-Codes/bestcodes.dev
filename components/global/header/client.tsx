"use client";

import OutboundLink from "@/components/global/links/outbound";
import { ThemeSwitcher } from "@/components/global/theme-switcher";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NavItems } from "./nav-items";

export default function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const scrollRange = [0, 200];
  const headerWidth = useTransform(scrollY, scrollRange, ["100%", "80%"]);
  const headerTop = useTransform(scrollY, scrollRange, ["0px", "25px"]);
  const headerBorderRadius = useTransform(scrollY, scrollRange, [0, 32]);
  const logoBorderRadius = useTransform(scrollY, scrollRange, [5, 20]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.div
      className="sticky z-50 mx-auto"
      style={{
        width: headerWidth,
        top: headerTop,
      }}
    >
      <motion.div
        className="bg-background/50 backdrop-blur-xs shadow-lg overflow-hidden"
        style={{
          borderRadius: headerBorderRadius,
        }}
      >
        <header className="h-16 flex items-center justify-between px-6">
          <div className="flex flex-row items-center gap-4">
            <Link href="/" aria-label="Best Codes Home">
              <div className="flex flex-row w-fit items-center gap-4">
                <motion.div
                  className="overflow-hidden"
                  style={{
                    borderRadius: logoBorderRadius,
                  }}
                >
                  <Image
                    src="/image/best_codes_logo_low_res.png"
                    alt="Best Codes logo"
                    aria-label="Best Codes logo"
                    width={40}
                    height={40}
                    className="h-8 w-8"
                  />
                </motion.div>
              </div>
            </Link>
            <nav aria-label="Main navigation" className="hidden md:block">
              <NavItems isMobile={false} />
            </nav>
          </div>
          <div className="flex flex-row justify-center items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <Button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              className="text-foreground"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          <div className="hidden md:flex flex-row items-center gap-4">
            <OutboundLink
              target="_blank"
              href="https://github.com/the-best-codes"
              aria-label="GitHub profile"
            >
              <Image
                src="/icons/github-dark.svg"
                alt="GitHub logo"
                width={40}
                height={40}
                className="h-8 w-8 dark:invert"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </OutboundLink>
            <OutboundLink
              target="_blank"
              href="https://dev.to/best_codes"
              aria-label="Dev dot two profile"
            >
              <Image
                src="/icons/dev-to.svg"
                alt="Dev.to logo"
                width={40}
                height={40}
                className="h-8 w-8 dark:invert"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </OutboundLink>
            <ThemeSwitcher />
          </div>
        </header>
        <motion.div
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={{
            open: { maxHeight: "500px", opacity: 1 },
            closed: { maxHeight: 0, opacity: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden md:hidden"
        >
          <nav className="px-6 py-4" aria-label="Mobile navigation">
            <NavItems isMobile={true} />
          </nav>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
