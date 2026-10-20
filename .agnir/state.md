# Current State — Holo Card Ultimate

## Project

- Canonical repository: https://github.com/mattamior/holo-card-ultimate
- Product name: 闪卡究极版 / Holo Card Ultimate.
- Current phase: foundational research and technical planning; **no Web editor, rendering engine, or prototype has been implemented**.
- The repository was newly created and Agnir Core 1.0 / repository-filesystem 1.0 is being initialized on `main`.

## Product scope

The word 闪卡 means optical-effect **character collectible cards**, historically encountered in snack promotions/card packs. It does **not** refer to two-sided educational memorization flashcards.

Intended experience: non-programmers can import character artwork, build a card, choose masked optical effects (rainbow holo foil, reflective border, metal/gloss, lenticular/flip, and combinations), preview angle-responsive behavior interactively on the Web, then save an editable project and export outputs.

Visual authenticity and material composability matter more than gratuitous flipping animations.

## Agreed open-source reference direction

Priority visual references (research and decompose techniques before selecting any code to reuse):

1. https://github.com/simeydotme/pokemon-cards-css
2. https://github.com/simeydotme/pokemon-cards-151
3. https://github.com/selop/pokebox

Explicitly excluded from the primary technology shortlist: `kongyo2/cards-css`, `simeydotme/hover-tilt`, `fito-cheol/Card-Animation-React`. Other projects can be researched for specific needs (masks, lenticular authoring, printing, export), subject to licenses.

## Unresolved architecture

No framework or rendering stack is yet finally selected. The earlier discussion proposed a layered optical-material engine with a visual editor, but implementation is pending investigation of the three preferred repositories.

Respect source licenses; do not copy GPL-licensed implementation into a closed-source project by assumption. Commercial/open-source distribution choices have not been determined.

## Source of authority

Principal decisions recorded in `.agnir/decisions.md`; remaining tasks in `.agnir/next-actions.md`; initialization evidence in `.agnir/evidence/`.
