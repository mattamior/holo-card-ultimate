# Next Actions — Holo Card Ultimate

1. **Perform source-level audit of the three approved visual references.** Inspect shader/CSS pipeline, reflection direction, interaction/tilt mapping, texture assets, masking, layering, dependencies, and current license per repository. Record findings with file/commit references.
2. **Compare how effects are produced.** Distinguish foil diffraction-style effects, glare, masked reflections, specular/metallic shading, character/background depth, and true lenticular multi-view switching. Identify reusable principles versus source-bound implementations.
3. **Define a modular optical effect contract.** Separate card document structure, editable layers, material/texture/mask state, light/view input, preview renderer, and export renderer. Recommend technology only after source audit.
4. **Prototype three acceptance cards:** full rainbow foil; normal character with independent holo background and border; multi-frame tilt-driven flip/lenticular visual with an independently reflective border.
5. **Evaluate feasibility and licensing.** Record attribution obligations, performance on desktop/mobile, browser sensor permissions, static/dynamic export limitations, and print-interlacing scope.
6. **Define MVP editor workflow and verifiable acceptance checks.** Asset import, layout, masking, material presets, live preview, project save/reopen, and export; do not declare these implemented before tests.

## Blockers / pending validation

- No source-level audit or code prototype is complete.
- Licensing and final Web stack are not yet selected.
- ChatGPT Project execution-surface locator setup may require manual configuration; repository activation is independent.
