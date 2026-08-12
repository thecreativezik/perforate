# Perforate

Perforate is an infinite-canvas sticker studio built to run inside ChatGPT. Its DialKit controls render changes directly onto the selected sticker in real time. ChatGPT image generation remains available as an optional in-place refinement for semantic artwork changes, while layout, copy, grade, palette, typography, crop, perforation, border, texture, and print treatment never require leaving the canvas.

The public web view is a complete preview and manual fallback. The primary experience is the fullscreen ChatGPT plugin at `/mcp`.

## Why this architecture

ChatGPT subscriptions and OpenAI API billing are separate products. A standalone website cannot spend a user’s ChatGPT Plus or Pro allowance. Perforate therefore runs as a ChatGPT plugin: the component posts the assembled generation brief into the current conversation, and ChatGPT performs native image generation under the signed-in user’s plan. No API key, account cookie, or unofficial browser automation is used.

## Product surface

- Infinite pan-and-zoom canvas with draggable, selectable sticker objects
- Six reference editions covering grades A–F
- Inline [DialKit](https://github.com/joshpuckett/dialkit) panel with controls for brief, scene, cast, palette, grade, stamp geometry, typography, print texture, and distress
- Live per-sticker recipes with instant selected-object rendering
- Optional native ChatGPT refinement through `ui/message` / `sendFollowUpMessage` without opening another site
- ChatGPT Library import through the host file APIs
- Local and widget-state persistence, duplicate/delete/download actions, presets, and responsive layout
- MCP Streamable HTTP endpoint at `/mcp`
- Public preview with the complete local live-editing experience

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the preview.

For ChatGPT Developer Mode, expose the server with an HTTPS tunnel and register `https://your-tunnel.example/mcp` under **Settings → Apps & Connectors → Advanced settings**. Ask ChatGPT to “open Perforate” or “make a financial mood sticker.”

## Validation

```bash
npm run check
```

This runs ESLint, TypeScript, Vitest, the standalone widget bundle, and the optimized Next.js production build.

## Production

Set `NEXT_PUBLIC_APP_URL` to the stable HTTPS deployment URL. Vercel builds the Next.js preview, MCP endpoint, and the self-contained ChatGPT widget bundle from one repository.

Pushes to `main` are automatically checked out, built, and deployed to the linked Vercel production project by `.github/workflows/deploy.yml`.

## Privacy

Perforate has no separate user database and does not collect OpenAI credentials. The published privacy notice is available at `/privacy.html`.
