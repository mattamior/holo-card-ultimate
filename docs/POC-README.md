# Holo Engine Playground v0.1

A zero-asset-download holographic collectible-card material proof of concept for **闪卡究极版 / Holo Card Ultimate**. The original fictional card illustration, masks, shader, and UI are authored in this repository. It is not a Pokémon reproduction.

## Quick start

```bash
npm install --no-audit --no-fund
npm run dev
```

Visit the local Vite URL. For production: `npm test && npm run build && npm run preview`.

## What you can test

1. **全息虹彩 / Full spectrum foil** — full-card rainbow interference simulation with an independently moving specular hotspot.
2. **局部镭射 + 闪边 / Reverse holo** — background-region mask leaves the central illustrated character unfoiled, while the rim has its own spectrum and strength.
3. **星砂浮雕 / Cosmic etch** — masked foil and sparse reproducible micro-sparkles plus contour response from a separate character silhouette mask.

Move a pointer across the card area (touch works). Focus the preview and use the arrow keys or `Home` for keyboard navigation. Adjust the four material sliders, switch presets, and click **保存此刻的光影** for a 1200×1680 transparent PNG at the current smoothed angle.

## Technical implementation

- **Rendering**: Three.js / WebGL2 / custom GLSL ShaderMaterial. The GLSL file is authored for this repository. No GPL third-party shader implementation was copied.
- **Data**: The original `src/assets/lunara.svg` image and two independently drawn SVG masks; masks are grayscale textures sampled by GLSL.
- **Interaction**: `src/core-optics.js` maps UI pointer coordinates to independent card tilt, highlight center, and foil phase. The math is testable without WebGL.
- **Controls**: `src/main.ts` owns one UI control model and sets Shader uniforms.
- **Export**: `CardRenderer.exportPng()` uses a dedicated WebGL render target, flips readback scanlines, and serializes a transparent PNG. This represents one captured view, **not a moving holographic print**.
- **Validation**: `npm test` covers pointer normalization, optical response separation, bounds, smoothing and preset behavior. GitHub Actions builds and tests. GPU compilation, cross-browser pixels, export alpha and performance need a real-browser QA pass; CI compilation alone does not establish optical visual acceptance.

## Known boundaries

- This is a **material prototype**, not a full editor: no user artwork import, freehand mask painting, undo/redo or editable project JSON yet.
- The cosmetic iridescence is an **artistic simulation**, not physically measured diffraction.
- Actual multi-view lenticular flip / interlaced physical printing are future modules, not claimed by this prototype.
- WebGL2, texture upload, and PNG readback need browser/GPU support. A useful error message is displayed if unavailable.
- GitHub Pages workflow is included; repository owner may need to set **Settings → Pages → Build and deployment → GitHub Actions** once before the live page publishes.
- Google Fonts are cosmetic only; local system fonts are fallback. Art and shader do not use an external network resource.

## Licensing

The CSS/GLSL/assets in this proof of concept are an independent implementation. No source or branded visual assets are taken from the GPL-3.0 Pokémon examples or Pokebox. **No repository-wide license is declared yet**; choose one after the product distribution requirements are decided.

## Project continuity

Work checkpoints are captured in the repository-owned `.agnir/` selected lineage, not exclusively in chat memory. Review `AGENTS.md` before continuing Project work.

## Browser smoke verification

GitHub CI additionally uses Playwright + Chromium/SwiftShader to load the production preview and exercise the real WebGL2 code path. It checks canvas readiness, effect switching, sliders, angular movement, and PNG signature / pixel dimensions. Run after build: `npx playwright install chromium && node tests/browser-smoke.mjs`. CI screenshots and a captured-pose PNG are uploaded as artifacts if produced. This test is separate from human optical quality acceptance.
