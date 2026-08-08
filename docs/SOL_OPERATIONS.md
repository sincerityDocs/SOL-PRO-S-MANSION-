# Sol Operating Guide

Use this guide when a user says, for example: "Continue Needle, review the latest work, update its state, and tell me what remains."

## 1. Resolve the project

Read `registry/projects.json` and select the exact stable ID. If the project is not registered, ask before adding a durable record.

## 2. Load the active working set

Read only:

- the registry record;
- the project's `STATE.md`;
- the project's `pointers.json`;
- the minimum referenced source or Drive sections needed for the objective.

Do not load historical archives or entire repositories into chat context.

## 3. Establish authority

Confirm which source owns the needed fact. Prefer current source and live evidence over summaries. Treat `proposed`, `historical`, `experimental`, and `configured_unverified` material according to their labels.

## 4. Choose the smallest capable room

- Use Composio for GitHub, Drive, Docs, Gmail, and other available SaaS actions.
- Use Codex for bounded repository engineering.
- Use Work for heavyweight artifact production.
- Use Hermes for optional orchestration, local tools, or sessions.
- Use Agent Society only when durable mission controls, approvals, or evidence are needed.
- Use Buzz or external repositories only when native tools cannot provide the required capability.

Do not route work through extra systems merely because they exist.

## 4a. Select an external repository when needed

Read `registry/repositories.json` and select the smallest repository that provides the missing capability. Use its pinned upstream commit and load only the relevant files.

- `upstream_link` means use or clone the upstream source as-is.
- `fork` means the `sincerityDocs` fork contains an intentional customization.
- `owned_adapter` means Mansion owns the integration contract while upstream source remains unchanged.

If source modification is required and `fork_url` is empty, create the `sincerityDocs` fork before changing code, preserve the original as `upstream`, and update the Mansion record. Do not copy the repository into Mansion merely to make it visible.

For Buzz, read `integrations/buzz/manifest.json`. Hermes remains the orchestrator; Buzz transports collaboration and evidence; runtime credentials stay outside GitHub.

## 5. Delegate with a bounded task envelope

Use `mansion.task.v1`. Provide the objective, constraints, minimum inputs, references, allowed actions, output requirements, and result destination. Never include secrets or large documents that already have a stable reference.

## 6. Persist and return references

Store substantial outputs in the authoritative repository, Drive, or artifact system. Return `mansion.result.v1` with a compact summary, change references, artifacts, evidence, warnings, and next actions.

## 7. Update durable state

Update the project's `STATE.md` or pointers only when the result changes the current objective, blocker, last meaningful result, or next intended action. Preserve uncertain historical material rather than silently overwriting it.

## Stop and ask the user when

- an action spends money or creates external consequences;
- a credential, identity, legal acceptance, MFA, CAPTCHA, or account decision is required;
- the requested project or authoritative source cannot be identified;
- changing an authority label would materially alter project direction;
- the task would require activating an unverified runtime or expanding scope.

## Compact continuation format

```text
Project: <stable-id>
Objective: <current objective>
Authority: <repo/docs/runtime>
Relevant pointers: <small list>
Last result: <artifact/run/commit>
Blockers: <current blockers>
Next action: <one bounded action>
```

## Local verification helpers

Codex, Work, or Hermes can run:

```text
npm run validate
npm run resolve -- <project-id>
```

Sol does not need computer-use to read or operate the GitHub-native Mansion.
