"use client";

import { Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NavItems } from "./nav-items";
import { ThemeSwitcher } from "@/components/global/theme-switcher";

export default function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  const scrollRange = [0, 200];
  const headerWidth = useTransform(scrollY, scrollRange, ["100%", "80%"]);
  const headerTop = useTransform(scrollY, scrollRange, ["0px", "25px"]);
  const headerBorderRadius = useTransform(scrollY, scrollRange, [0, 32]);
  const logoBorderRadius = useTransform(scrollY, scrollRange, [5, 20]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
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
            borderBottomLeftRadius: isMobile && isMenuOpen ? 0 : undefined,
            borderBottomRightRadius: isMobile && isMenuOpen ? 0 : undefined,
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
              {!isMobile && (
                <nav aria-label="Main navigation">
                  <NavItems isMobile={false} />
                </nav>
              )}
            </div>
            {isMobile ? (
              <div className="flex flex-row justify-center items-center gap-2">
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
            ) : (
              <div className="flex flex-row items-center gap-4">
                <Link
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
                </Link>
                <Link
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
                </Link>
                <ThemeSwitcher />
              </div>
            )}
          </header>
        </motion.div>
      </motion.div>

      {/* Separate fixed menu that appears connected to header */}
      {isMobile && (
        <motion.div
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, y: 0 },
            closed: { opacity: 0, y: -20 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 right-0 z-40 mx-auto overflow-hidden bg-background/50 backdrop-blur-xs shadow-lg"
          style={{
            width: headerWidth,
            top: `calc(${typeof headerTop === "string" ? headerTop : "0px"} + 64px)`, // 64px is header height
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            visibility: isMenuOpen ? "visible" : "hidden",
            pointerEvents: isMenuOpen ? "auto" : "none",
          }}
        >
          <nav className="px-6 py-4" aria-label="Mobile navigation">
            <NavItems isMobile={true} />
          </nav>
        </motion.div>
      )}
    </>
  );
}
