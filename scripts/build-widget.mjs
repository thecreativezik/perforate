import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "dist-widget");
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [path.join(root, "src/widget-entry.tsx")],
  outfile: path.join(outDir, "widget.js"),
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["es2022"],
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts", ".css": "css" },
});

const appCss = await readFile(path.join(root, "dist-widget/widget.css"), "utf8");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>${appCss}</style></head><body><div id="root"></div><script>window.__PERFORATE_BASE_URL__="__PERFORATE_BASE_URL__";</script><script>${await readFile(path.join(outDir, "widget.js"), "utf8")}</script></body></html>`;
await writeFile(path.join(outDir, "widget.html"), html);
