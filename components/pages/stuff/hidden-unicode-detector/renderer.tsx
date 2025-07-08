import * as React from "react";
import { Token } from "./types";

export function renderTokens(tokens: Token[]): React.ReactNode[] {
  return tokens.map((token, idx) => {
    switch (token.type) {
      case "plain":
        return <React.Fragment key={idx}>{token.value}</React.Fragment>;
      case "unicodeTag":
        return (
          <span
            key={idx}
            className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 rounded-sm px-1.5 py-0.5 cursor-help border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
            title={`Unicode Tag Decoded: ${token.decodedTokens.map((t) => (t.type === "plain" ? t.value : "")).join("")}\nOriginal Unicode Tag Characters: ${JSON.stringify(token.originalChars.split("").map((c) => `U+${c.codePointAt(0)?.toString(16).toUpperCase()}`))}`}
          >
            {renderTokens(token.decodedTokens)}
          </span>
        );
      case "variantSelector":
        return (
          <span
            key={idx}
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-sm px-1.5 py-0.5 cursor-help border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
            title={`Variant Selector: ${token.decodedValue}\nOriginal: U+${token.originalChar.codePointAt(0)?.toString(16).toUpperCase()}`}
          >
            {token.decodedValue}
          </span>
        );
      case "sneakyBits":
        const titleText = token.isDecoded
          ? `Sneaky Bits Decoded: ${token.decodedTokens.map((t) => (t.type === "plain" ? t.value : "")).join("")}\nOriginal Binary Sequence: ${token.originalChars
              .split("")
              .map((c) => (c === "\u2062" ? "0" : "1"))
              .join("")}`
          : `Sneaky Bits (Undecodable, not a full byte sequence or invalid UTF-8)\nOriginal Binary Sequence: ${token.originalChars
              .split("")
              .map((c) => (c === "\u2062" ? "0" : "1"))
              .join("")}`;

        return (
          <span
            key={idx}
            className="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded-sm px-1.5 py-0.5 cursor-help border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
            title={titleText}
          >
            {renderTokens(token.decodedTokens)}
          </span>
        );
      case "invisible":
        return (
          <span
            key={idx}
            className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 rounded-sm px-1.5 py-0.5 cursor-help border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors inline-flex items-center gap-1"
            title={token.name}
          >
            <span className="text-xs">◯</span>
          </span>
        );
      default:
        return null;
    }
  });
}
