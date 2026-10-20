# 2026-10-20 — Priority visual sources static audit

## Authorized purpose

Principal previously selected three visual references for source-level investigation before engine design:
1. simeydotme/pokemon-cards-css
2. simeydotme/pokemon-cards-151
6. selop/pokebox

Principal excluded alternatives #3/#4/#5. User later asked to continue once Agnir was configured.

## GitHub source receipts (selected branch main)

- #1: acb1197633e749a1fba4412231db2f6581586d00; repository LICENSE GPL-3.0; Svelte 3 / CSS. Inspected Card.svelte, CardProxy.svelte, orientation.js, base.css, regular-holo.css, reverse-holo.css, rainbow-holo.css, cosmos-holo.css.
- #2: 98030f941cdc4919b648457200277e29b60d5f5a; LICENSE GPL-3.0; Svelte 3 / CSS. Inspected Card.svelte, CardProxy.svelte, base.css, ex-regular.css, ex-special-illustration-rare.css, poke-ball-holo.css.
- #6: 7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80; LICENSE MIT; Vue 3 / Three.js / GLSL. Inspected package.json, architecture.md, shaderRegistry.ts, buildCard.ts, ShaderUniformUpdater.ts, useThreeScene.ts, useFaceTracking.ts, useGyroscope.ts, useMouseTilt.ts, useCardLoader.ts, cardCatalog.ts, regular-holo.frag, special-illustration-rare.frag, shared glsl modules and shader test sources.

## Material Project changes

- Created docs/research/visual-reference-source-audit.md with revision-pinned file/line evidence, observed techniques, license and asset caveats, comparison, untested gaps.
- Created docs/architecture/optical-engine-proposal.md with a **proposal only**, not an accepted decision, for layered optical materials and POC stages.
- Reconciled Current State and Next Actions. Principal's durable decisions unchanged.

## Limitations / validation contract

Reading GitHub source through connector is **static inspection**, not clone/build/test/deployed-render verification. Do not claim real FPS or visual fidelity parity. No new user-approved library reuse or production architecture choice was made.

Keep Project identity and lineage unchanged; this checkpoint belongs only to the authoritative main lineage.
