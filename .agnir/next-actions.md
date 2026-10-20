# Next Actions — Holo Card Ultimate

1. **Verify CI on the PoC commit:** npm install, 8 Node tests, TypeScript `tsc --noEmit`, Vite build; fix errors before claiming runnable build.
2. **Verify GitHub Pages deployment.** The workflow is present, but owner may need Settings → Pages → GitHub Actions. Only share a live URL after successful deployment readback.
3. **Perform real WebGL2 browser smoke tests:** shader compilation, textures/masks alignment, three presets, independent sliders, pointer/keyboard/touch, front alpha and PNG 1200×1680 export pixel validation.
4. **Request Principal visual acceptance** of all three presets, with snapshots at centered and ±15° poses.
5. **Benchmark desktop/mobile** performance, DPR, memory, CORS and WebGL fallback behavior; choose budgets based on measurement.
6. **Commit npm package-lock** once a networked npm install is available and switch CI to `npm ci` for reproducibility.
7. **Iterate independent optical shaders** (quality and mask bleed) before creating the complete no-code editor.
8. **Later:** customizable assets, layers, painting masks, editable project JSON, export options; true multi-view lenticular separately from single-image visual foil.
9. **Review licensing/provenance** and establish a product license only after a distribution decision.
10. **Verify genuinely fresh ChatGPT Project Agnir activation** from a separate new conversation.

Current evidence: local Node math/static Shader tests passed 8/8. Actual GPU render/build/deploy not yet accepted.
