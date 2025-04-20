import { clsx, type ClassValue } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeHtml = (html: string | undefined): string => {
  try {
    if (!html) {
      return "";
    }
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    return "";
  }
};
