# Current State — Holo Card Ultimate

## Project

- Canonical repository: https://github.com/mattamior/holo-card-ultimate
- Product name: 闪卡究极版 / Holo Card Ultimate.
- Agnir: v1.0.2 distribution, Core 1.0, repository-filesystem/1.0; selected authoritative continuity on main.
- Current phase: **source-level research and architecture proposal**. There is **no implemented Web editor, optical shader prototype or tested export pipeline**.
- ChatGPT Project persistent locator: Principal reported configuration complete; genuine independent fresh-session activation is not yet verified here.

## Product scope

闪卡 means angle-responsive optical-effect character collectible cards (holographic foil, reflective border, metallic, glitter, lenticular/flip combinations), NOT educational front/back memorization cards.

Goal: a high-fidelity, zero-code, Web collectible-card creation studio with editable material regions and projects, accurate motion-driven preview, and export.

## Preferred visual references and exclusions

- Priority #1: https://github.com/simeydotme/pokemon-cards-css
- Priority #2: https://github.com/simeydotme/pokemon-cards-151
- Priority #6: https://github.com/selop/pokebox
- Excluded from candidate shortlist: kongyo2/cards-css, simeydotme/hover-tilt, fito-cheol/Card-Animation-React.
- Specialized other projects remain optional, subject to need and license review.

## Technical research completed (2026-10-20)

A **static, revision-pinned GitHub source audit** for #1/#2/#6 has been saved at docs/research/visual-reference-source-audit.md. It identifies CSS/GLSL foil synthesis, independent pointer/background/highlight signals, fine-grained glitter masks, off-axis projection, per-frame local card UV calculation, uniform registry and source-license constraints.

A separate, explicitly **unapproved proposal** has been saved at docs/architecture/optical-engine-proposal.md. It recommends decoupling CardDocument, AssetStore, MaskEditor, InputAdapter, GPU MaterialEngine, Renderer, and Exporter.

No on-device visual comparison, performance benchmarks, legal clearance, Shader integration or live browser output validation was performed. No framework or license/distribution strategy has been decided.

## Source of authority

- Agreed product decisions: .agnir/decisions.md (unchanged by this research).
- Remaining tasks: .agnir/next-actions.md.
- Source audit/proposal: docs/research/ and docs/architecture/.
- Research receipt: .agnir/evidence/2026-10-20-three-visual-source-audit.md.
