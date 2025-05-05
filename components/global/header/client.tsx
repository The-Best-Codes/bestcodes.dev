"use client";
import OutboundLink from "@/components/global/links/outbound";
import { ThemeSwitcher } from "@/components/global/theme-switcher";
import { Button } from "@/components/ui/button";
import devToLogo from "@/public/icons/dev-to.svg";
import githubLogo from "@/public/icons/github-dark.svg";
import profileImage from "@/public/image/best_codes_logo_low_res.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { NavItems } from "./nav-items";

export default function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const innerHeaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const headerElement = headerRef.current;
    const innerHeaderElement = innerHeaderRef.current;
    const logoElement = logoRef.current;

    if (!headerElement || !innerHeaderElement || !logoElement) return;

    const scrollTriggers: ScrollTrigger[] = [];

    const fadeInTween = gsap.to(innerHeaderElement, {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
    });

    const headerTween = gsap.to(headerElement, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: 200,
        scrub: 0.5,
      },
      width: "80%",
      top: "25px",
      ease: "none",
    });
    if (headerTween.scrollTrigger)
      scrollTriggers.push(headerTween.scrollTrigger);

    const innerHeaderTween = gsap.to(innerHeaderElement, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: 200,
        scrub: 0.5,
      },
      borderRadius: 32,
      ease: "none",
    });
    if (innerHeaderTween.scrollTrigger)
      scrollTriggers.push(innerHeaderTween.scrollTrigger);

    const logoTween = gsap.to(logoElement, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: 200,
        scrub: 0.5,
      },
      borderRadius: 20,
      ease: "none",
    });
    if (logoTween.scrollTrigger) scrollTriggers.push(logoTween.scrollTrigger);

    return () => {
      fadeInTween.kill();
      scrollTriggers.forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    const mobileNavElement = mobileNavRef.current;
    if (!mobileNavElement) return;

    gsap.killTweensOf(mobileNavElement);

    if (isMenuOpen) {
      gsap.to(mobileNavElement, {
        maxHeight: "500px",
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(mobileNavElement, {
        maxHeight: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isMenuOpen]);

  return (
    <div
      ref={headerRef}
      className="sticky z-50 mx-auto"
      style={{
        width: "100%",
        top: "0px",
      }}
    >
      <div
        ref={innerHeaderRef}
        className="bg-accent/50 backdrop-blur-xs shadow-lg overflow-hidden"
        style={{
          borderRadius: 0,
          opacity: 0,
        }}
      >
        <header
          role="banner"
          className="h-16 flex items-center justify-between px-4"
        >
          <div className="flex flex-row items-center gap-4">
            <Link href="/" aria-label="Best Codes Home">
              <div className="flex flex-row w-fit items-center gap-4">
                <div
                  ref={logoRef}
                  className="overflow-hidden"
                  style={{
                    borderRadius: 5,
                  }}
                >
                  <Image
                    src={profileImage}
                    alt="Best Codes logo"
                    aria-label="Best Codes logo"
                    className="h-8 w-8"
                    placeholder="blur"
                  />
                </div>
              </div>
            </Link>
            <nav
              role="navigation"
              aria-label="Main navigation"
              className="hidden md:block"
            >
              <NavItems pathname={pathname} isMobile={false} />
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
                src={githubLogo}
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
                src={devToLogo}
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
        <div
          ref={mobileNavRef}
          className="overflow-hidden md:hidden"
          style={{ maxHeight: 0, opacity: 0 }}
        >
          <nav
            role="navigation"
            className="px-4 py-4"
            aria-label="Mobile navigation"
          >
            <NavItems pathname={pathname} isMobile={true} />
          </nav>
        </div>
      </div>
    </div>
  );
}
