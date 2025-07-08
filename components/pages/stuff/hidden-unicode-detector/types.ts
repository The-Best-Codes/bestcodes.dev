export type Token =
  | {
      type: "plain";
      value: string;
      originalStartIdx: number;
      originalEndIdx: number;
    }
  | {
      type: "unicodeTag";
      originalChars: string;
      decodedTokens: Token[];
      originalStartIdx: number;
      originalEndIdx: number;
    }
  | {
      type: "variantSelector";
      originalChar: string;
      decodedValue: string;
      originalStartIdx: number;
      originalEndIdx: number;
    }
  | {
      type: "sneakyBits";
      originalChars: string;
      decodedTokens: Token[];
      isDecoded: boolean;
      originalStartIdx: number;
      originalEndIdx: number;
    }
  | {
      type: "invisible";
      originalChar: string;
      name: string;
      originalStartIdx: number;
      originalEndIdx: number;
    };

export interface CategoryCounts {
  totalHidden: number;
  unicodeTags: number;
  variantSelectors: number;
  sneakyBitChars: number;
  sneakyBitBytes: number;
  invisibleOthers: number;
}

export interface DetectedCharacter {
  key: number;
  display: string;
  name: string;
  position: number;
  type: Token["type"];
  originalChar: string;
}
