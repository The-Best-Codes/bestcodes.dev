import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine-oniguruma.mjs";
import minDark from "shiki/themes/min-dark.mjs";
//import minLight from "shiki/themes/min-light.mjs";
import javascriptLang from "shiki/langs/javascript.mjs";
import typescriptLang from "shiki/langs/typescript.mjs";
import tsxLang from "shiki/langs/tsx.mjs";
import jsxLang from "shiki/langs/jsx.mjs";
import htmlLang from "shiki/langs/html.mjs";
import cssLang from "shiki/langs/css.mjs";
import jsonLang from "shiki/langs/json.mjs";
import bashLang from "shiki/langs/shellscript.mjs";
import markdownLang from "shiki/langs/markdown.mjs";
import pythonLang from "shiki/langs/python.mjs";
import javaLang from "shiki/langs/java.mjs";
import cLang from "shiki/langs/c.mjs";
import cppLang from "shiki/langs/cpp.mjs";

import wasm from "shiki/wasm";

const globalRef = globalThis as unknown as { __shikiHighlighter?: ReturnType<typeof createHighlighterCore> };
const highlighter = globalRef.__shikiHighlighter ??= createHighlighterCore({
  themes: [minDark],
  langs: [
    javascriptLang,
    typescriptLang,
    tsxLang,
    jsxLang,
    htmlLang,
    cssLang,
    jsonLang,
    bashLang,
    markdownLang,
    pythonLang,
    javaLang,
    cLang,
    cppLang,
  ],
  engine: createOnigurumaEngine(wasm),
});

export default highlighter;
