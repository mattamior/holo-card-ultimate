# Durable Decisions — Holo Card Ultimate

## Accepted by the Principal

- **Terminology:** 闪卡 refers to optical-effect physical collectible character cards (holographic, foil, reflective borders, lenticular and combinations); *not* educational front/back flashcards.
- **Product goal:** A high-fidelity, angle-responsive, zero-code Web studio for ordinary users to author and combine these effects. Interaction should express optical material response, not merely rotate a flat image.
- **Repository name:** `mattamior/holo-card-ultimate`; product name `Holo Card Ultimate / 闪卡究极版`.
- **Preferred primary visual references:**
  - `simeydotme/pokemon-cards-css` (original investigation #1)
  - `simeydotme/pokemon-cards-151` (original investigation #2)
  - `selop/pokebox` (original investigation #6)
- **Explicit exclusions from the technical shortlist:**
  - `kongyo2/cards-css` (original #3)
  - `simeydotme/hover-tilt` (original #4)
  - `fito-cheol/Card-Animation-React` (original #5)
- **Other repositories:** inspect only when a specialized capability is needed; not blanket adoption.
- **Sequence:** source-level technical study of #1/#2/#6 **before** committing to a rendering-engine architecture.

## Not yet decided

- Final frontend stack, editor framework, shader/runtime strategy, distribution/license model, exact material presets, or implementation milestones are proposals only.
- Never import third-party assets/code without a valid right to use them.

## Continuity policy

- Agnir `1.0.2` distribution, Core `1.0`, repository/filesystem profile `1.0` for this new Project.
- Canonical Project identity and logical lineage remain stable independently of the main-branch Git ref and commit receipts.

## Prototype renderer direction (2026-10-20)

The Principal acknowledged the technical distinction between WebGL/GLSL and Three.js + GLSL and instructed continuation. The **PoC** uses WebGL2 + original GLSL via Three.js for scene/texture/camera management, plus Vite/TypeScript. This is a bounded prototype choice, **not** final product/editor framework approval. The full editor, license, and multi-view lenticular scope remain undecided. No Pokémon art, GPL CSS, or Pokebox assets/source were copied into the PoC.
