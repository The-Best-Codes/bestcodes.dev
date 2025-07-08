import {
  BINARY_0_CHAR,
  BINARY_1_CHAR,
  INVISIBLE_CHAR_MAP,
  UNICODE_TAG_ASCII_START,
  UNICODE_TAG_END,
  VARIATION_SELECTOR_END_BASIC,
  VARIATION_SELECTOR_END_SUPPLEMENT,
  VARIATION_SELECTOR_START_BASIC,
  VARIATION_SELECTOR_START_SUPPLEMENT,
  VS2_OFFSET,
} from "./constants";
import { Token } from "./types";

export function parseText(
  text: string,
  currentOffset: number = 0,
): { tokens: Token[]; nextOffset: number } {
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    const originalStartIdx = currentOffset + i;
    const codePoint = text.codePointAt(i)!;
    const char = String.fromCodePoint(codePoint);
    const charLength = char.length;

    // Handle Unicode Tag characters (E0000-E007F range)
    if (codePoint >= UNICODE_TAG_ASCII_START && codePoint <= UNICODE_TAG_END) {
      let tagContentChars: string[] = [];
      let currentTagIndex = i;
      let rawTagChars = "";

      // Collect consecutive Unicode Tag characters
      while (currentTagIndex < text.length) {
        const innerCodePoint = text.codePointAt(currentTagIndex)!;
        const innerChar = String.fromCodePoint(innerCodePoint);
        const innerCharLength = innerChar.length;

        if (
          innerCodePoint >= UNICODE_TAG_ASCII_START &&
          innerCodePoint <= UNICODE_TAG_END
        ) {
          rawTagChars += innerChar;

          // Convert Unicode Tag character to ASCII
          // All Unicode Tag characters in the range can be decoded to ASCII
          tagContentChars.push(
            String.fromCharCode(innerCodePoint - UNICODE_TAG_ASCII_START),
          );

          currentTagIndex += innerCharLength;
        } else {
          break;
        }
      }

      if (tagContentChars.length > 0) {
        const tagDecodedString = tagContentChars.join("");
        const recursiveResult = parseText(tagDecodedString, 0);
        tokens.push({
          type: "unicodeTag",
          originalChars: rawTagChars,
          decodedTokens: recursiveResult.tokens,
          originalStartIdx: originalStartIdx,
          originalEndIdx: currentOffset + currentTagIndex,
        });
        i = currentTagIndex;
        continue;
      }
    }

    if (char === BINARY_0_CHAR || char === BINARY_1_CHAR) {
      let binarySequence = "";
      let rawBinaryChars = "";
      let currentBinaryIndex = i;

      while (currentBinaryIndex < text.length) {
        const innerChar = text[currentBinaryIndex];
        if (innerChar === BINARY_0_CHAR || innerChar === BINARY_1_CHAR) {
          rawBinaryChars += innerChar;
          binarySequence += innerChar === BINARY_0_CHAR ? "0" : "1";
          currentBinaryIndex++;
        } else {
          break;
        }
      }

      const decodedBytes: string[] = [];
      let isValidDecoding = true;

      for (let j = 0; j < binarySequence.length; j += 8) {
        const byteStr = binarySequence.slice(j, j + 8);
        if (byteStr.length === 8) {
          const byteValue = parseInt(byteStr, 2);
          decodedBytes.push(String.fromCharCode(byteValue));
        } else {
          isValidDecoding = false;
          break;
        }
      }

      let decodedTokens: Token[] = [];
      if (isValidDecoding && decodedBytes.length > 0) {
        const decodedString = decodedBytes.join("");
        try {
          const utf8Decoded = decodeURIComponent(escape(decodedString));
          const recursiveResult = parseText(utf8Decoded, 0);
          decodedTokens = recursiveResult.tokens;
        } catch {
          decodedTokens = [
            {
              type: "plain",
              value: decodedString,
              originalStartIdx: 0,
              originalEndIdx: decodedString.length,
            },
          ];
        }
      }

      tokens.push({
        type: "sneakyBits",
        originalChars: rawBinaryChars,
        decodedTokens: decodedTokens,
        isDecoded: isValidDecoding && decodedBytes.length > 0,
        originalStartIdx: originalStartIdx,
        originalEndIdx: currentOffset + currentBinaryIndex,
      });
      i = currentBinaryIndex;
      continue;
    }

    if (
      (codePoint >= VARIATION_SELECTOR_START_BASIC &&
        codePoint <= VARIATION_SELECTOR_END_BASIC) ||
      (codePoint >= VARIATION_SELECTOR_START_SUPPLEMENT &&
        codePoint <= VARIATION_SELECTOR_END_SUPPLEMENT)
    ) {
      let decodedValue = "";
      if (
        codePoint >= VARIATION_SELECTOR_START_BASIC &&
        codePoint <= VARIATION_SELECTOR_END_BASIC
      ) {
        const vsIndex = codePoint - VARIATION_SELECTOR_START_BASIC + 1;
        decodedValue = `VS${vsIndex}`;
      } else {
        const vsIndex =
          codePoint - VARIATION_SELECTOR_START_SUPPLEMENT + VS2_OFFSET + 1;
        decodedValue = `VS${vsIndex}`;
      }

      tokens.push({
        type: "variantSelector",
        originalChar: char,
        decodedValue: decodedValue,
        originalStartIdx: originalStartIdx,
        originalEndIdx: originalStartIdx + charLength,
      });
      i += charLength;
      continue;
    }

    if (INVISIBLE_CHAR_MAP[char]) {
      tokens.push({
        type: "invisible",
        originalChar: char,
        name: INVISIBLE_CHAR_MAP[char],
        originalStartIdx: originalStartIdx,
        originalEndIdx: originalStartIdx + charLength,
      });
      i += charLength;
      continue;
    }

    // Check for other invisible characters
    if (
      (codePoint >= 0x0000 && codePoint <= 0x0008) ||
      (codePoint >= 0x000e && codePoint <= 0x001f) ||
      codePoint === 0x007f ||
      (codePoint >= 0x0080 && codePoint <= 0x009f)
    ) {
      tokens.push({
        type: "invisible",
        originalChar: char,
        name: `Control Character (U+${codePoint.toString(16).toUpperCase().padStart(4, "0")})`,
        originalStartIdx: originalStartIdx,
        originalEndIdx: originalStartIdx + charLength,
      });
      i += charLength;
      continue;
    }

    // Plain text handling
    let plainTextValue = "";
    let currentPlainIndex = i;

    while (currentPlainIndex < text.length) {
      const currentCodePoint = text.codePointAt(currentPlainIndex)!;
      const currentChar = String.fromCodePoint(currentCodePoint);
      const currentCharLength = currentChar.length;

      const isSpecial =
        (currentCodePoint >= UNICODE_TAG_ASCII_START &&
          currentCodePoint <= UNICODE_TAG_END) ||
        currentChar === BINARY_0_CHAR ||
        currentChar === BINARY_1_CHAR ||
        (currentCodePoint >= VARIATION_SELECTOR_START_BASIC &&
          currentCodePoint <= VARIATION_SELECTOR_END_BASIC) ||
        (currentCodePoint >= VARIATION_SELECTOR_START_SUPPLEMENT &&
          currentCodePoint <= VARIATION_SELECTOR_END_SUPPLEMENT) ||
        INVISIBLE_CHAR_MAP[currentChar] ||
        (currentCodePoint >= 0x0000 && currentCodePoint <= 0x0008) ||
        (currentCodePoint >= 0x000e && currentCodePoint <= 0x001f) ||
        currentCodePoint === 0x007f ||
        (currentCodePoint >= 0x0080 && currentCodePoint <= 0x009f);

      if (isSpecial) {
        break;
      }

      plainTextValue += currentChar;
      currentPlainIndex += currentCharLength;
    }

    if (plainTextValue) {
      tokens.push({
        type: "plain",
        value: plainTextValue,
        originalStartIdx: originalStartIdx,
        originalEndIdx: currentOffset + currentPlainIndex,
      });
    }

    i = currentPlainIndex;
  }

  return { tokens, nextOffset: currentOffset + text.length };
}
