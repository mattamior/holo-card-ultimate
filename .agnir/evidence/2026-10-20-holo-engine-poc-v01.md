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

## GitHub CI / first Pages results

- Workflow `Validate Optical Prototype` run [39405564584](https://github.com/mattamior/holo-card-ultimate/actions/runs/39405564584): **success**, including npm install, 8 tests, `npm run build` (TypeScript + Vite), artifact upload.
- First workflow `Publish Optical Playground` run [39405564569](https://github.com/mattamior/holo-card-ultimate/actions/runs/39405564569): **failure** at `actions/configure-pages@v5`, error “Get Pages site failed ... Not Found”; steps npm install, test and build passed. This does not prove a code defect or a deployed site.
- Corrective attempt: add `enablement: true` to `configure-pages@v5` and rerun on main. Requires fresh verification; may still require owner action.

## Browser smoke harness staging

Added Playwright Chromium/SwiftShader test with Vite preview serving the actual production dist, application-ready/three-canvas check, preset/slider checks, pointer response, transparent PNG 1200×1680 download and screenshot artifact. **Not yet run at this checkpoint**; pending CI result, no PASS is claimed.
