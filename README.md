# Perforate

Perforate is an infinite-canvas sticker studio built to run inside ChatGPT. It turns a short creative brief and a dense set of art-direction controls into a production-ready prompt for ChatGPT Images, then lets the user bring the finished image back from their ChatGPT Library and arrange it alongside as many editions as they want.

The public web view is a complete preview and manual fallback. The primary experience is the fullscreen ChatGPT plugin at `/mcp`.

## Why this architecture

ChatGPT subscriptions and OpenAI API billing are separate products. A standalone website cannot spend a user’s ChatGPT Plus or Pro allowance. Perforate therefore runs as a ChatGPT plugin: the component posts the assembled generation brief into the current conversation, and ChatGPT performs native image generation under the signed-in user’s plan. No API key, account cookie, or unofficial browser automation is used.

## Product surface

- Infinite pan-and-zoom canvas with draggable, selectable sticker objects
- Six reference editions covering grades A–F
- Inline [DialKit](https://github.com/joshpuckett/dialkit) panel with controls for brief, scene, cast, palette, grade, stamp geometry, typography, print texture, and distress
- Native ChatGPT handoff through `ui/message` / `sendFollowUpMessage`
- ChatGPT Library import through the host file APIs
- Local and widget-state persistence, duplicate/delete/download actions, presets, and responsive layout
- MCP Streamable HTTP endpoint at `/mcp`
- Public preview fallback that copies the art brief and opens ChatGPT

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
