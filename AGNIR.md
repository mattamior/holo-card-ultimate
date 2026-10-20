# Agnir Project Instructions

Canonical Executor-facing activation and Project-operation instructions for **Holo Card Ultimate (闪卡究极版)**. This file is Project content, not the continuity state itself.

## Activation

1. **Authorized root:** Use only the root of `mattamior/holo-card-ultimate` at the ref the Principal or execution surface supplied. Do not search sibling projects or infer another repository.
2. **Discover:** Read root `AGNIR.yaml`. Validate `agnir.version`, `agnir.discovery_profile`, `project.identity`, and `continuity.lineage`. Resolve and validate any VCS selector/binding independently; a Git ref or commit SHA is not logical lineage identity.
3. **Load:** Read the selected lineage's declared Current State and Next Actions. Read Decisions and Evidence when material. Use these Project-owned records as the durable context; newer Principal instructions and direct Project observations supersede stale records.
4. **Work:** Perform the requested product/engineering task using the loaded Project truth. Do not conflate optical collectible cards with educational flashcards.

## Checkpoint

At finish, save, or repository commit boundaries:

1. Reconcile observed Project truth, completed work, decisions, outstanding next steps, and relevant Evidence; do not paste conversation transcripts.
2. If the durable truth is unchanged, checkpoint evaluation is a **no-op**; do not manufacture `.agnir/` file changes.
3. If material truth changed, construct a complete, coherent candidate for the **selected logical lineage**, validate it, and publish it with the relevant Project changes where possible.
4. Reject stale-base checkpoint publication with `AGNIR_CHECKPOINT_CONFLICT`; re-read authoritative state and reconcile before retrying. Do not silently overwrite sibling lineages.
5. Fresh-resolve the same Project identity, selected lineage, and memory after publication.

## Repository operations

- In repository context, `commit` / `提交` / `提交代码` means: checkpoint evaluation → Project-defined pre-commit checks (when any) → commit.
- `commit and push` / `提交推送` means: checkpoint evaluation → applicable checks → commit → push → verify the actual destination ref.
- Prefer one coherent repository revision for Project modifications and material continuity updates.
- For merge/rebase/cherry-pick across lineages, reconcile target continuity using the integrated Project and source Evidence before target publication. Never copy source continuity automatically.

## Compatibility and reference

- Current contract: Agnir Core `1.0` and `repository-filesystem/1.0` (declared in `AGNIR.yaml`).
- Install/upgrade/migrate/repair procedures are governed by the upstream pinned [Agnir v1.0.2 SKILL.md](https://github.com/iorLab/agnir/blob/v1.0.2/SKILL.md), not by reinterpretation of this file.
- The README section `Agnir Project Instructions` is a backward-compatible locator only; it must not contain a parallel procedure.
