import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    href: "https://github.com/The-Best-Codes",
    icon: "github-dark.svg",
    caption: "GitHub",
  },
  {
    href: "https://dev.to/best_codes",
    icon: "dev-to.svg",
    caption: "dev.to",
  },
  {
    href: "https://discord.gg/dKeuR9yfBs",
    icon: "discord.svg",
    caption: "Discord",
  },
  {
    href: "https://makerworld.com/en/@Best_codes",
    icon: "move-3d.svg",
    caption: "MakerWorld",
  },
  {
    href: "https://x.com/the_best_codes",
    icon: "x.svg",
    caption: "X (Twitter)",
  },
  {
    href: "https://peerlist.io/bestcodes",
    icon: "peerlist.svg",
    caption: "Peerlist",
  },
  {
    href: "https://codeium.com/profile/best_codes",
    icon: "codeium.svg",
    caption: "Codeium",
  },
  {
    href: "mailto:bestcodes.official+bcdev-socials@gmail.com",
    icon: "email.svg",
    caption: "Email Me",
  },
];

export default function OnlineAccounts() {
  return (
    <div className="w-full max-w-4xl rounded-md mt-4">
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {socialLinks.map((link, index) => (
            <Link key={index} href={link.href} target="_blank">
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  src={`/icons/${link.icon}`}
                  alt={`${link.icon.split(".")[0]} icon`}
                  width={128}
                  height={128}
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 dark:invert"
                />
                <span className="text-sm sm:text-md text-primary text-center">
                  {link.caption}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
