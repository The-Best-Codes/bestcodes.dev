import { clsx, type ClassValue } from "clsx";
import sanitizeHtmlLib from "sanitize-html";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeHtml = (html: string | undefined): string => {
  try {
    if (!html) {
      return "";
    }
    return sanitizeHtmlLib(html, {
      allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtmlLib.defaults.allowedAttributes,
        img: ["src", "alt", "title", "width", "height"],
      },
    });
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    return "";
  }
};
