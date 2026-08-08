# Sol Pro Mansion Foundation Design

## Purpose

Sol Pro's Mansion is a lightweight, GitHub-native front door for durable project state. It lets Sol, Work, Codex, Composio, Hermes, Buzz, and future runtimes enter a project through small, stable references instead of moving full histories through chat.

The Mansion does not replace Composio, Hermes, Agent Society, Google Drive, or any project repository. It records where authority lives and how work moves between those systems.

## Ownership boundaries

- The Mansion repository owns the project registry, capability registry, compact project state, handoff contracts, operating guidance, and proof examples.
- Each source repository remains authoritative for its code and engineering history.
- Google Drive remains authoritative for long-form human-readable material. Mansion records document links or IDs when they are known.
- Composio MCP remains Sol's native SaaS action layer. Mansion does not wrap its GitHub, Drive, Docs, Gmail, or other tools.
- Hermes remains an optional orchestrator and local execution layer. Its local projects, sessions, kanban, MCP connections, skills, and runtime storage are not copied into Mansion.
- Agent Society remains an optional control plane for missions, approvals, artifacts, and handoffs. It is not required for Sol to read Mansion.
- Buzz remains an optional collaboration and external-runtime bridge.
- Codex and Work remain execution specialists that operate on referenced repositories and artifacts.

## Repository structure

```text
README.md
package.json
registry/
  projects.json
  capabilities.json
projects/
  mansion/
  needle/
  agent-society/
protocols/
  artifact-reference.schema.json
  task-envelope.schema.json
  result-envelope.schema.json
docs/
  ARCHITECTURE.md
  EXISTING_STATE_MAP.md
  SOL_OPERATIONS.md
  superpowers/
    specs/
    plans/
scripts/
  mansion-lib.mjs
  resolve-project.mjs
  validate-mansion.mjs
examples/
  first-proof/
```

Each project directory contains `PROJECT.md`, `STATE.md`, and `pointers.json`. The Markdown files are short human entry points. The JSON file supplies machine-readable references without embedding large documents.

## Durable-state flow

1. Resolve a stable project ID from `registry/projects.json`.
2. Read the project's `STATE.md` and `pointers.json`.
3. Follow only the GitHub, Drive, artifact, or local references needed for the active objective.
4. Sol acts through Composio or delegates bounded execution to Work, Codex, Hermes, Buzz, or another declared capability.
5. Large results remain in the authoritative repository, Drive, or artifact store.
6. The worker returns a compact result envelope containing references and evidence.
7. Update the project's state and last meaningful result pointer when appropriate.

## Contracts

The task envelope identifies the project, bounded objective, constraints, inputs, references, allowed actions, output requirements, and result destination. The result envelope reports status, summary, changes, artifacts, evidence, warnings, and next actions. Both use the artifact-reference contract for external pointers.

Schemas are strict: unknown fields and missing required fields fail validation. They contain no credentials or embedded large payloads.

## Authority and failure handling

Project and capability records use explicit evidence states such as `verified`, `user_verified`, `documented`, `configured_unverified`, `unavailable`, and `proposed`. Missing or unavailable references produce a clear failure; the resolver never invents a replacement.

Local-only paths are labeled as such so Sol does not mistake them for cloud-accessible resources. Historical or experimental material is never treated as authoritative merely because it exists.

## First proof

The harmless first proof resolves the `mansion` project, validates a bounded task envelope, validates its compact completed result envelope, and confirms that every registered project points to readable Mansion state files. It does not call paid models, mutate Drive, start Agent Society, or exercise consequential external actions.

## Verification budget

- Run the Mansion validator once.
- Run the Mansion resolver happy path once.
- If a blocking defect appears, fix only that defect and repeat the failed check once.

## Explicitly deferred

- Drive synchronization or custom Composio wrappers.
- A database, dashboard, queue, or event bus.
- Starting or repairing Agent Society services.
- Activating Buzz or external capability repositories.
- Credential configuration.
- Broad production hardening or multi-project automation.
