# Design QA — A-style live sticker template

- Source visual truth: `/var/folders/gd/1q_srfxd10d5npkcmr7pz4_80000gn/T/codex-clipboard-7877e894-60d8-4f22-80ec-ce79fa70c6a5.png`
- Browser-rendered implementation: `/tmp/perforate-a-final.png`
- Normalized focused comparison: `/tmp/perforate-design-qa.png`
- Route and state: `http://localhost:3000/`, default desktop state with “Budget Acrobat” selected and the DialKit controls active
- Viewport: 1280 × 720 CSS px at browser density 1
- Source pixels: 718 × 491; implementation pixels: 1280 × 720
- Density normalization: source A sticker and selected implementation sticker were cropped to their visible card regions, scaled proportionally to a shared 400 × 528 comparison area, padded to 420 × 568, and placed side by side.

## Full-view comparison evidence

The source shows a small green backing, a single white perforated stamp sheet, a large top artwork panel, and an editorial footer with headline/caption/health row plus an oversized grade at right. The implementation now uses that same hierarchy inside the selected canvas item. The selected editor no longer renders the former C-style card-within-a-card composition.

The surrounding product UI intentionally remains the existing Perforate canvas and DialKit panel rather than reproducing the screenshot’s simplified canvas chrome.

## Focused-region comparison evidence

The normalized side-by-side comparison confirms matching region proportions and construction: green backing margin, white perforated paper edge, artwork-first composition, left-aligned footer copy, health metadata row, and grade anchored at the lower right. The implementation’s image content differs because it is the selected C-grade source artwork; image replacement and crop/zoom controls are provided so the user can use any illustration.

## Required fidelity surfaces

- Fonts and typography: The target’s bold grotesk headline, compact caption, tiny health label, and oversized grade hierarchy are represented. Font family is an intentional close product-system match; controls expose headline scale, weight, alignment, colors, caption scale, grade style, and grade scale.
- Spacing and layout rhythm: Artwork occupies the upper 72%, footer the lower region, with editable paper padding, perforation, image inset, footer padding, gap, and four footer layouts. Desktop, 900 px tablet, and 390 px mobile states were rendered; canvas and settings remain reachable.
- Colors and visual tokens: Backing, paper, artwork background/tint, footer, divider, headline, caption, grade, label, and icon colors are independently editable. Backing and major regions can be disabled.
- Image quality and asset fidelity: Real supplied sticker artwork is used; there are no placeholder illustrations. Source images can be replaced from ChatGPT Library or local upload, with cover/contain/fill, zoom, crop, rotation, opacity, tint, brightness, contrast, and saturation controls.
- Copy and content: Headline, caption, descriptive brief, grade, and footer label are editable, and headline/caption/label/icons/grade can each be hidden.
- Icons: The metadata row uses consistent Phosphor icon assets rather than text glyphs or improvised SVGs.
- Accessibility and interaction: Major actions are semantic buttons with accessible names. Backing Off/On was tested and visibly changed the selected sticker without navigation; the state was restored. Responsive settings remain usable in stacked mobile layout.

## Findings

No actionable P0, P1, or P2 mismatch remains for the requested A-style template conversion.

Residual P3: The exact source screenshot’s typeface is unavailable, so the implementation uses the product’s existing bold grotesk/mono system. This does not change hierarchy or usability.

## Comparison history

1. Initial comparison — blocked
   - P1: the selected sticker still behaved like a nested stamp/card rather than the A-style single stamp composition.
   - P2: the outer perforation mask intersected incorrectly and could collapse to a flat backing color.
   - Fixes: rebuilt the live renderer into backing → perforated paper → artwork → footer layers; corrected the four-edge perforation mask sizing; added the A-style copy/grade footer.
   - Post-fix evidence: `/tmp/perforate-a-template-final.png` and `/tmp/perforate-design-qa.png` show the single-layer stamp construction.

2. Focused hierarchy pass — blocked
   - P2: grade hierarchy was smaller than the source A sticker.
   - Fix: increased the oversized grade’s responsive clamp and labeled the controls “A-style live template.”
   - Post-fix evidence: `/tmp/perforate-a-final.png` shows the larger lower-right grade and finalized panel label.

3. Final interaction and responsive pass — passed
   - Tested desktop, 900 × 720 tablet, and 390 × 844 mobile rendering.
   - Tested Backing Off/On live behavior and confirmed the canvas URL did not change.
   - Confirmed the Replace selected image action is present and enabled.
   - Console warnings/errors checked: none.

## Primary interactions tested

- Select and live-render a sticker in A template
- Expand the Backing group
- Toggle the backing off and on, with immediate canvas update
- Keep the selected sticker, canvas, and settings panel on the same route
- Verify image replacement and ChatGPT regeneration actions are present
- Verify tablet and mobile stacked layouts

## Implementation checklist

- [x] Single A-style perforated stamp template
- [x] Optional/colored outer backing
- [x] Editable paper and perforations
- [x] Editable artwork region and source replacement
- [x] Optional editable footer/text/grade/icons
- [x] Print and color treatment controls
- [x] Real-time per-sticker DialKit updates
- [x] Responsive and runtime checks

final result: passed
