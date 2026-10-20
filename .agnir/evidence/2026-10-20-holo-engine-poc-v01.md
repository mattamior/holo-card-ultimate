# 2026-10-20 — Holo Engine Playground v0.1 evidence

## Authority

Principal selected projects #1/#2/#6 as optical technical references, clarified that WebGL/GLSL was the underlying route and Three.js was a supporting renderer, then asked to continue. PoC scope: interactive and independently authored optical material playground, not full editor.

## Material work completed

- Vite / TypeScript app; Three.js rendering on WebGL2 with a custom GLSL fragment shader; original artwork and two original image masks.
- Three effects: rainbow foil, masked background foil plus independently driven shine border, and glitter/contour etch effect.
- Mouse/touch/keyboard normalized pose, independent foil/highlight/tilt signals, four live uniforms, controls reset and deterministic per-view PNG readback via WebGLRenderTarget.
- Static CSS/HTML interface, original themed illustration and mobile layout; Node contract tests; GitHub CI and Pages workflows; `docs/POC-README.md`.

## Validation receipts (local)

- Node 22 / `npm test`: 8 passing, 0 failed (angle normalization, input clamping, motion convergence, preset behavior, shader uniform/zone/colour-space static contracts).
- Original SVG rasterized successfully with CairoSVG and visually reviewed.
- `node --check src/core-optics.js`: no syntax errors.

## Not claimed

Local npm registry network unavailable: dependencies were not installed and full TypeScript/Vite build did not run locally. No actual GLSL GPU compilation or WebGL export pixel evidence, mobile FPS, Pages deployment or Principal visual acceptance is available yet. Existing research and product licensing decisions stay intact. The authoritative Agnir project/lineage are unchanged.
