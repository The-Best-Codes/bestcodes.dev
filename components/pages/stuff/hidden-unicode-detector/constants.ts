export const HIDDEN_UNICODE_DEFINITIONS = [
  { char: "\u200B", name: "Zero Width Space (U+200B)" },
  { char: "\u200C", name: "Zero Width Non-Joiner (U+200C)" },
  { char: "\u200D", name: "Zero Width Joiner (U+200D)" },
  { char: "\u200E", name: "Left-to-Right Mark (U+200E)" },
  { char: "\u200F", name: "Right-to-Left Mark (U+200F)" },
  { char: "\u202A", name: "Left-to-Right Embedding (U+202A)" },
  { char: "\u202B", name: "Right-to-Left Embedding (U+202B)" },
  { char: "\u202C", name: "Pop Directional Formatting (U+202C)" },
  { char: "\u202D", name: "Left-to-Right Override (U+202D)" },
  { char: "\u202E", name: "Right-to-Left Override (U+202E)" },
  { char: "\u2060", name: "Word Joiner (U+2060)" },
  { char: "\u2061", name: "Function Application (U+2061)" },
  { char: "\u2062", name: "Invisible Times (U+2062)" },
  { char: "\u2063", name: "Invisible Separator (U+2063)" },
  { char: "\u2064", name: "Invisible Plus (U+2064)" },
  { char: "\u2066", name: "Left-to-Right Isolate (U+2066)" },
  { char: "\u2067", name: "Right-to-Left Isolate (U+2067)" },
  { char: "\u2068", name: "First Strong Isolate (U+2068)" },
  { char: "\u2069", name: "Pop Directional Isolate (U+2069)" },
  { char: "\u00A0", name: "Non-breaking Space (U+00A0)" },
  { char: "\uFEFF", name: "Byte Order Mark / ZWNBSP (U+FEFF)" },
  { char: "\u061C", name: "Arabic Letter Mark (U+061C)" },
  { char: "\u180E", name: "Mongolian Vowel Separator (U+180E)" },
  { char: "\u00AD", name: "Soft Hyphen (U+00AD)" },
  { char: "\uFFFE", name: "Non-character (U+FFFE)" },
  { char: "\uFFFF", name: "Non-character (U+FFFF)" },
];

export const INVISIBLE_CHAR_MAP = Object.fromEntries(
  HIDDEN_UNICODE_DEFINITIONS.map((u) => [u.char, u.name]),
);

export const BINARY_0_CHAR = "\u2062";
export const BINARY_1_CHAR = "\u2064";

export const UNICODE_TAG_BEGIN = 0xe0001;
export const UNICODE_TAG_END = 0xe007f;
export const UNICODE_TAG_ASCII_START = 0xe0000;

export const VARIATION_SELECTOR_START_BASIC = 0xfe00;
export const VARIATION_SELECTOR_END_BASIC = 0xfe0f;
export const VARIATION_SELECTOR_START_SUPPLEMENT = 0xe0100;
export const VARIATION_SELECTOR_END_SUPPLEMENT = 0xe01ef;
export const VS2_OFFSET = 16;
