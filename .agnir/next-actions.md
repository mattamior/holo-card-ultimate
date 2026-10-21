# Next Actions — Holo Card Ultimate

1. **CI is green on PoC commit**: run 39405564584 verified npm install, 8 tests, TypeScript check, and Vite build. Re-run on future changes.
2. **Verify GitHub Pages enablement/deployment.** First run 39405564569 failed because the Pages site was not configured. Latest attempt failed with `Resource not accessible by integration` at configure-pages. Principal must enable Pages in Settings → Pages → GitHub Actions, then rerun publishing. Only share a URL after verified success.
3. **v0.2 browser CI + standalone packaging passed** on run 39565274685 (retro sample, six sliders, PNG export, self-contained HTML artifact); next perform user/hardware visual QA: shader compilation, textures/masks alignment, three presets, independent sliders, pointer/keyboard/touch, front alpha and PNG 1200×1680 export pixel validation.
4. **Request Principal visual acceptance** of all four presets, including retro, with snapshots at centered and ±15° poses. Distribute the single-file standalone artifact without Pages.
5. **Benchmark desktop/mobile** performance, DPR, memory, CORS and WebGL fallback behavior; choose budgets based on measurement.
6. **Commit npm package-lock** once a networked npm install is available and switch CI to `npm ci` for reproducibility.
7. **Verify and visually rate v0.2 optical shader revision** (grating clarity, narrow highlight under ±15°, mask bleed, color ink retention, vintage foil design), then iterate on any issues before editing features.
8. **Later:** customizable assets, layers, painting masks, editable project JSON, export options; true multi-view lenticular separately from single-image visual foil.
9. **Review licensing/provenance** and establish a product license only after a distribution decision.
10. **Verify genuinely fresh ChatGPT Project Agnir activation** from a separate new conversation.

Current evidence: local Node math/static Shader tests passed 8/8. Actual GPU render/build/deploy not yet accepted.
