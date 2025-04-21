import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine-oniguruma.mjs";
import { bundledLanguages } from "shiki/langs";
import minDark from "shiki/themes/min-dark.mjs";
import wasm from "shiki/wasm";

const globalRef = globalThis as unknown as {
  __shikiHighlighter?: ReturnType<typeof createHighlighterCore>;
};
const highlighter = (globalRef.__shikiHighlighter ??= createHighlighterCore({
  themes: [minDark],
  langs: Object.values(bundledLanguages),
  engine: createOnigurumaEngine(wasm),
}));

export default highlighter;
