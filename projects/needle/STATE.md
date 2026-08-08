# Needle State

Authority: pointer summary; verify against the Needle repository

Status: active

## Current entry point

- Repository: `https://github.com/sincerityDocs/Needle`
- Default/release branch observed: `main` at `5e147db243c722c0696246df545bbe3efc17fc0c`
- `main` README identifies the current released version as v0.3.1.
- Active development branch observed: `general-intake` at `5ee7b44466abf078c23a2ab887f0531a0dab7aba`.
- On 2026-08-08, GitHub comparison `main...general-intake` reported `general-intake` 37 commits ahead and 0 behind across 102 changed files.
- The development delta includes release notes through v0.3.7, a V1 API, durable per-tenant/operator spend ceilings, signed SSRF-guarded async webhooks, VPS execution/deployment work, escalation/implementation flows, and a beta operator tool for issuing/revoking tenant keys.
- Local source path for Codex/Work recorded during Mansion inspection: `C:/dev/needle/source`.

## Current caution

Needle's repository contains the authoritative project state. Historical Sol Pro handoffs and provenance documents are reference material, not current implementation instructions when they conflict with live repository state.

Do not assume the default branch contains all current development work. `main` is the released v0.3.1 baseline, while `general-intake` currently contains a substantial unmerged development line. Do not merge or promote it automatically; establish release intent and verification first.

## Last Mansion proof

On 2026-08-08, Sol resumed Needle through Mansion without loading the historical handoff archive. The bounded task was a read-only branch reconciliation. Evidence is recorded in `projects/needle/RESUME_PROOF_2026-08-08.md`.

## Next intended action

Before continuing implementation, treat `general-intake` as the leading development candidate and verify its release/test evidence and intended promotion path. Only then decide whether to continue there, cut a release branch, or merge to `main`.
