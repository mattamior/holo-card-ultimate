# Current State — Holo Card Ultimate

- Project: https://github.com/mattamior/holo-card-ultimate (`main`); Agnir Core/profile 1.0, logical authoritative lineage unchanged.
- Product: 闪卡究极版 is a collectible optical/holographic card authoring studio, **not an educational flashcard** tool.
- User's priority GitHub visual references remain #1 `simeydotme/pokemon-cards-css`, #2 `simeydotme/pokemon-cards-151`, #6 `selop/pokebox`. Exclude earlier #3/#4/#5 as major design bases.
- Research: `docs/research/visual-reference-source-audit.md`, architecture proposal: `docs/architecture/optical-engine-proposal.md` (not yet an approved permanent product stack).
- User says ChatGPT Project root AGENTS.md locator is configured; independently fresh-context recovery verification still pending.

## New PoC v0.1 (2026-10-20)

Added lightweight TypeScript + Vite / Three.js WebGL2 renderer with original GLSL, an original SVG moth collectible-card illustration and independent background/character masks. Three sample presets: full rainbow foil, masked background foil + independent edge shine, cosmic micro-sparkle / etched contour. Sliders independently adjust four optical parameters; mouse/touch/keyboard pose input and current-view transparent 1200×1680 PNG export are implemented in source.

This is a **material playground**, not a general asset-upload or mask-painting editor and not a true lenticular multi-view or physical-print tool. All artwork/shader code was independently produced for this PoC, not imported from the GPL projects or Pokémon.

Local Node 22 `npm test`: **8/8 passed** (logic and shader source contracts). SVG rasterized/visually inspected. GitHub CI run [39405564584](https://github.com/mattamior/holo-card-ultimate/actions/runs/39405564584) passed npm install, all 8 Node tests, TypeScript typechecking and Vite production build. The local environment cannot reach npm registry; WebGL runtime shader compilation, PNG browser readback, and FPS/mobile visual quality have **not** yet been independently verified. GitHub Actions workflows were added for validation and Pages publication; monitor their results and do not claim success before checks.

See `docs/POC-README.md` and `.agnir/evidence/2026-10-20-holo-engine-poc-v01.md`.

GitHub Pages initial workflow run [39405564569](https://github.com/mattamior/holo-card-ultimate/actions/runs/39405564569) failed at configure-pages: Pages site not found. Latest Pages attempt [39406598507](https://github.com/mattamior/holo-card-ultimate/actions/runs/39406598507) failed at configure-pages: Create Pages site failed (Resource not accessible by integration). Principal must enable Pages in Settings → Pages → GitHub Actions and rerun publication; no live Pages URL verified.

A real-browser CI smoke harness (Playwright Chromium/SwiftShader) **passed** on commit 8861a6cd5d696522bd154d691512242cd5a4d4cc: [validation run 39406598658](https://github.com/mattamior/holo-card-ultimate/actions/runs/39406598658) succeeded, including actual WebGL2 readiness, preset switching, slider binding, angular response and PNG dimension checks. This is automated smoke validation, not human visual acceptance or hardware performance testing.
