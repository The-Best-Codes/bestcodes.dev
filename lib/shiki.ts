import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Only the languages the blog uses, with the JS regex engine instead of the
// Oniguruma WASM one. Loading every bundled grammar made static generation
// several times slower. Add a language here if a new post needs it; until then
// its code blocks render as plain text.
export const highlighter = createHighlighterCore({
  themes: [
    import("shiki/themes/light-plus.mjs"),
    import("shiki/themes/dark-plus.mjs"),
  ],
  langs: [
    import("shiki/langs/bash.mjs"),
    import("shiki/langs/dotenv.mjs"),
    import("shiki/langs/javascript.mjs"),
    import("shiki/langs/json.mjs"),
    import("shiki/langs/jsx.mjs"),
    import("shiki/langs/typescript.mjs"),
  ],
  engine: createJavaScriptRegexEngine(),
});
