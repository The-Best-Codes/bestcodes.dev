import OutboundLink from "@/components/global/links/outbound";
import codeiumLogo from "@/public/icons/codeium.svg";
import devToLogo from "@/public/icons/dev-to.svg";
import discordLogo from "@/public/icons/discord.svg";
import emailIcon from "@/public/icons/email.svg";
import githubLogo from "@/public/icons/github-dark.svg";
import makerworldLogo from "@/public/icons/move-3d.svg";
import peerlistLogo from "@/public/icons/peerlist.svg";
import xLogo from "@/public/icons/x.svg";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://github.com/The-Best-Codes",
    icon: githubLogo,
    caption: "GitHub",
  },
  {
    href: "https://dev.to/best_codes",
    icon: devToLogo,
    caption: "dev.to",
  },
  {
    href: "https://discord.gg/dKeuR9yfBs",
    icon: discordLogo,
    caption: "Discord",
  },
  {
    href: "https://makerworld.com/en/@Best_codes",
    icon: makerworldLogo,
    caption: "MakerWorld",
  },
  {
    href: "https://x.com/the_best_codes",
    icon: xLogo,
    caption: "X (Twitter)",
  },
  {
    href: "https://peerlist.io/bestcodes",
    icon: peerlistLogo,
    caption: "Peerlist",
  },
  {
    href: "https://codeium.com/profile/best_codes",
    icon: codeiumLogo,
    caption: "Codeium",
  },
  {
    href: "mailto:bestcodes.official+bcdev-socials@gmail.com",
    icon: emailIcon,
    caption: "Email Me",
  },
];

export default function OnlineAccounts() {
  return (
    <div className="w-full max-w-4xl rounded-md mt-4">
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {socialLinks.map((link, index) => (
            <OutboundLink key={index} href={link.href} target="_blank">
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  src={link.icon}
                  alt={`${link.caption} icon`}
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 hover:scale-105 transition-transform dark:invert"
                />
                <span className="text-sm sm:text-md text-primary text-center">
                  {link.caption}
                </span>
              </div>
            </OutboundLink>
          ))}
        </div>
      </div>
    </div>
  );
}
