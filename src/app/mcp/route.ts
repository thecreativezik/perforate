import { readFile } from "node:fs/promises";
import path from "node:path";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const WIDGET_URI = "ui://perforate/studio-v1.html";

function publicBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const handler = createMcpHandler(
  (server) => {
    server.registerResource(
      "Perforate sticker studio",
      WIDGET_URI,
      {
        title: "Perforate Sticker Studio",
        description: "Fullscreen infinite-canvas art direction studio for creating collectible postage-stamp stickers with ChatGPT.",
        mimeType: "text/html;profile=mcp-app",
        _meta: {
          ui: {
            prefersBorder: false,
            domain: new URL(publicBaseUrl()).hostname,
            csp: {
              connectDomains: [publicBaseUrl(), "https://chatgpt.com"],
              resourceDomains: [publicBaseUrl(), "https://*.oaistatic.com", "https://*.oaiusercontent.com"],
            },
          },
          "openai/widgetDescription": "Perforate is a fullscreen sticker editor with a DialKit art-direction panel and an infinite canvas. Users compose a brief, ask ChatGPT to generate the image, then import it from their ChatGPT Library.",
          "openai/widgetPrefersBorder": false,
          "openai/widgetCSP": {
            connect_domains: [publicBaseUrl(), "https://chatgpt.com"],
            resource_domains: [publicBaseUrl(), "https://*.oaistatic.com", "https://*.oaiusercontent.com"],
          },
        },
      },
      async (uri) => {
        const widget = await readFile(path.join(process.cwd(), "dist-widget/widget.html"), "utf8");
        return {
          contents: [{
            uri: uri.href,
            mimeType: "text/html;profile=mcp-app",
            text: widget.replaceAll("__PERFORATE_BASE_URL__", publicBaseUrl()),
            _meta: {
              ui: {
                prefersBorder: false,
                domain: new URL(publicBaseUrl()).hostname,
                csp: {
                  connectDomains: [publicBaseUrl(), "https://chatgpt.com"],
                  resourceDomains: [publicBaseUrl(), "https://*.oaistatic.com", "https://*.oaiusercontent.com"],
                },
              },
            },
          }],
        };
      },
    );

    server.registerTool(
      "open_sticker_studio",
      {
        title: "Open Perforate Sticker Studio",
        description: "Use this when the user wants to design, generate, edit, arrange, compare, or collect postage-stamp style stickers. Opens the fullscreen infinite canvas and DialKit art-direction controls.",
        inputSchema: z.object({
          brief: z.string().max(1200).optional().describe("Optional initial description of the desired sticker"),
          headline: z.string().max(100).optional().describe("Optional exact sticker headline"),
          grade: z.enum(["A", "B", "C", "D", "E", "F"]).optional().describe("Optional financial-health grade"),
        }),
        outputSchema: z.object({
          status: z.literal("ready"),
          view: z.literal("sticker-studio"),
          message: z.string(),
          initialRecipe: z.object({
            brief: z.string().optional(),
            headline: z.string().optional(),
            grade: z.enum(["A", "B", "C", "D", "E", "F"]).optional(),
          }),
        }),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          openWorldHint: false,
          idempotentHint: true,
        },
        _meta: {
          ui: { resourceUri: WIDGET_URI },
          "openai/outputTemplate": WIDGET_URI,
          "openai/widgetAccessible": true,
          "openai/toolInvocation/invoking": "Opening the sticker studio…",
          "openai/toolInvocation/invoked": "Sticker studio ready",
        },
      },
      async ({ brief, headline, grade }) => {
        const structuredContent = {
          status: "ready" as const,
          view: "sticker-studio" as const,
          message: "Perforate is ready. Use the settings panel to direct the next sticker, then generate it with ChatGPT.",
          initialRecipe: { brief, headline, grade },
        };
        return {
          structuredContent,
          content: [{ type: "text", text: "The Perforate studio is open. Adjust the recipe and select Generate in ChatGPT; after the image is created, add it from your ChatGPT Library." }],
          _meta: { ui: { resourceUri: WIDGET_URI }, "openai/outputTemplate": WIDGET_URI },
        };
      },
    );
  },
  {
    serverInfo: { name: "perforate", version: "1.0.0" },
    instructions: "Perforate helps people art-direct collectible postage-stamp stickers. When sticker creation or editing is requested, call open_sticker_studio. The UI sends a complete visual prompt back into ChatGPT for native image generation under the user's ChatGPT plan.",
  },
);

export { handler as GET, handler as POST };
