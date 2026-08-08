# Mansion Run Automation Design

## Goal

Give Sol one deterministic way to turn a completed bounded task into durable Mansion state after Sol performs GitHub or Drive actions through its existing Composio tools.

## Chosen approach

Add a repository-local `record-run` command. It accepts a valid `mansion.task.v1` file and matching `mansion.result.v1` file, stores both under the task's declared result directory, updates the project's `last_meaningful_run`, and registers new Drive references in the project's pointer file.

Composio remains responsible for OAuth and external actions. The command never stores credentials or calls Google directly. It only records verified references returned by Sol's tool call, so Chat, Work, and Codex can all resume from the same compact state.

## Data flow

1. Sol resolves a project and creates a bounded task envelope.
2. Sol performs the allowed GitHub or Drive action through Composio.
3. Sol creates the matching result envelope using the returned durable references.
4. `npm run record -- --task <path> --result <path>` validates and records the run.
5. Future project resolution returns the updated run and Drive pointers.

## Guardrails

- Reject unknown projects, invalid envelopes, mismatched task/result identifiers, and result destinations outside the repository.
- Only register `kind: drive` references already present in the validated result.
- Deduplicate Drive references by URI.
- Do not modify `STATE.md` automatically; semantic project-state edits remain an explicit agent decision.
- Keep Sol's existing Needle proof branch separate from this automation branch.

## First live use

Create or reuse a `Sol Pro's Mansion` Drive folder, create a compact Needle project brief inside it, record both Drive IDs in a bounded Needle run, and persist the updated pointers on this automation branch.
