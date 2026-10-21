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

## Optical material iteration v0.2 (2026-10-21)

Principal accepted the v0.1 review goal: improve optical realism (narrow angle-selective high-intensity specular/diffraction, micro-grating, metallic undercoat), and add a classic 90s/00s collectible-card visual contrast. Implemented original GLSL `card.frag.glsl` modifications, uMetal/uDetail uniforms/sliders, a fourth vintage star-emboss/halftone preset with an original thunder-lynx SVG and its own masks; retained the same rendering/export chain. This is **an authored candidate until CI/runtime/visual validation**. Existing tests were extended. No third-party art or GPL implementation imported; v0.2 is an artistic optical simulation, not physically calibrated diffraction.

## v0.2 runtime check and portable packaging (2026-10-21)

Commit cc1b7c645eb829ac4005a1d40ed88bb0f770d128 passed Node tests, TypeScript/Vite production build and Chromium/SwiftShader WebGL2 browser smoke in [CI run 39564398859](https://github.com/mattamior/holo-card-ultimate/actions/runs/39564398859), including original retro card asset/preset, six sliders and PNG export. Actual human visual-quality score and mobile GPU benchmarks remain pending. A reproducible single-HTML packaging script is being added for direct user testing without Pages; local container Chromium blocks WebGL2 even at about:blank (browser policy), so its standalone offline rendering is not independently GPU-verified in this environment.

## v0.2 portable packer correction

Packaging CI [39565042966](https://github.com/mattamior/holo-card-ultimate/actions/runs/39565042966) found a JS `String.replace()` replacement-string bug: `$&` in minified Three.js source was expanded to the matched script tag and produced a false unresolved-assets check. Changed replace arguments to callbacks so bundled source is inserted literally. The previous core prototype CI 39564398859 was green; the packaging repair **passed full CI 39565274685** at commit 6efcea67a4110c7f29568be5e214dda720c37c82, including 9 Node contract tests, TypeScript/Vite build, reproducible standalone HTML packaging, Chromium/SwiftShader browser smoke and artifact upload. The standalone HTML file was extracted from that successful workflow artifact and checked for no unresolved Pages asset URLs and syntax-valid inline JS. Actual file:// execution was not verified due container/browser WebGL restriction; human visual review remains pending.
