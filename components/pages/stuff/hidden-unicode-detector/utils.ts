import { CategoryCounts, DetectedCharacter, Token } from "./types";

export function calculateStats(tokens: Token[]): CategoryCounts {
  let totalHidden = 0;
  let unicodeTags = 0;
  let variantSelectors = 0;
  let sneakyBitChars = 0;
  let sneakyBitBytes = 0;
  let invisibleOthers = 0;

  for (const token of tokens) {
    if (token.type === "unicodeTag") {
      totalHidden++;
      unicodeTags++;
    } else if (token.type === "variantSelector") {
      totalHidden++;
      variantSelectors++;
    } else if (token.type === "sneakyBits") {
      totalHidden++;
      sneakyBitChars++;
      sneakyBitBytes += token.originalChars.length;
    } else if (token.type === "invisible") {
      totalHidden++;
      invisibleOthers++;
    }
  }

  return {
    totalHidden,
    unicodeTags,
    variantSelectors,
    sneakyBitChars,
    sneakyBitBytes,
    invisibleOthers,
  };
}

export function extractDetectedCharacters(
  tokens: Token[],
  renderTokens: (tokens: Token[]) => React.ReactNode[],
): DetectedCharacter[] {
  return tokens.flatMap((token) => {
    if (token.type === "plain") return [];

    const originalCharDisplay = getOriginalCharDisplay(token);

    return [
      {
        key: token.originalStartIdx,
        display: `${originalCharDisplay
          .split("")
          .map(
            (c: string) =>
              `\\u{${c.codePointAt(0)?.toString(16).toUpperCase()}}`,
          )
          .join("")}`,
        name: getTokenName(token, renderTokens),
        position: token.originalStartIdx + 1,
        type: token.type,
        originalChar: originalCharDisplay,
      },
    ];
  });
}

function getOriginalCharDisplay(token: Token): string {
  switch (token.type) {
    case "unicodeTag":
    case "sneakyBits":
      return token.originalChars;
    case "variantSelector":
    case "invisible":
      return token.originalChar;
    default:
      return "";
  }
}

function getTokenName(
  token: Token,
  renderTokens: (tokens: Token[]) => React.ReactNode[],
): string {
  switch (token.type) {
    case "unicodeTag":
      return `Unicode Tag (Decoded: "${renderTokens(token.decodedTokens)
        .map((n) => (typeof n === "string" ? n : (n as any).props.children))
        .join("")}")`;
    case "variantSelector":
      return `Variant Selector (Decoded: "${token.decodedValue}")`;
    case "sneakyBits":
      return `Sneaky Bit Sequence (${
        token.isDecoded
          ? 'Decoded: "' +
            renderTokens(token.decodedTokens)
              .map((n) =>
                typeof n === "string" ? n : (n as any).props.children,
              )
              .join("") +
            '"'
          : "Undecodable"
      })`;
    case "invisible":
      return token.name;
    default:
      return "";
  }
}
