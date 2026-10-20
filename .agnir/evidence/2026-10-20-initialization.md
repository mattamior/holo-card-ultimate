# 2026-10-20 — Agnir initialization evidence

## Authorized target

- Repository: https://github.com/mattamior/holo-card-ultimate
- Selected authoritative ref: `refs/heads/main`.
- Repository observed empty before bootstrap (GitHub Contents returned “This repository is empty.”; repository size reported 0).
- Principal asked explicitly to install and initialize Agnir from https://github.com/iorLab/agnir.

## Agnir upstream provenance

- Stable GitHub Release: https://github.com/iorLab/agnir/releases/tag/v1.0.2
- Published as non-draft and non-prerelease on 2026-09-18.
- Immutable published source: `b5626394ec40a5cb7a28c01892acde07cc0adc8e`.
- Core compatibility: `1.0`.
- Repository/filesystem profile: `repository-filesystem/1.0`.
- Procedure: https://github.com/iorLab/agnir/blob/v1.0.2/SKILL.md

## Initial Project truth

The product is an optical collectible card creation studio, not an educational flashcard system. The Principal preferred visual references #1 `pokemon-cards-css`, #2 `pokemon-cards-151`, #6 `pokebox`; explicitly excluded #3 `cards-css`, #4 `hover-tilt`, #5 `Card-Animation-React`. No product code existed as of initialization.

## Activation route to validate after publication

`AGENTS.md` → `AGNIR.md` → `AGNIR.yaml` → `.agnir/state.md`, `.agnir/next-actions.md`, `.agnir/decisions.md`, `.agnir/evidence/`.

The root README includes a backward-compatible locator. Execution-surface bootstrap, if needed for fresh ChatGPT Project conversations, is a separate step.
