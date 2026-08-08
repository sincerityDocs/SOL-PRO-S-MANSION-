# Mansion Architecture

## Guiding principle

Persist project state externally and place only the active working set in model context.

```text
Sol / ChatGPT
  |
  +-- Mansion registry and compact project state
  |
  +-- Composio MCP ------ GitHub / Drive / Docs / SaaS actions
  |
  +-- Work / Codex ------ bounded execution and artifacts
  |
  +-- Hermes ------------ optional orchestration and local tools
  |      |
  |      +-- Agent Society / n8n / PostgreSQL
  |      +-- Buzz / external runtimes / capability repositories
  |
  +-- Human approval ---- consequential actions and authority changes
```

Mansion sits above these systems as an index and contract layer. It does not become a competing database, tool platform, or orchestrator.

## Durable-state ownership

| Surface | Owns | Mansion stores |
| --- | --- | --- |
| Project GitHub repository | Source, configuration, tests, engineering history | Repository and commit/path references |
| Google Drive | Briefs, research, decisions, plans, manuals, long reports | Document IDs, links, and relevant sections |
| Mansion | Registry, active state summaries, pointers, handoff contracts | Small Markdown and JSON records |
| Composio | Authenticated SaaS actions | Capability name and evidence state |
| Codex / Work | Bounded execution and generated artifacts | Task/result references |
| Hermes | Optional reasoning, delegation, sessions, projects, and local tools | Invocation handle and result pointer |
| Agent Society | Optional mission ledger, approvals, runs, artifacts, and handoffs | Mission/run/artifact references |
| Buzz | Optional collaboration and external-runtime transport | Room/run/result references |

## Context budgeting

- Resolve one project before reading files.
- Load the project's compact state first.
- Follow only references needed for the active objective.
- Use deltas: what changed, why, evidence, blockers, and next action.
- Keep large outputs at their authoritative location.
- Never embed a file merely because another agent might need it later.

## Authority labels

- `authoritative` — the system that owns the information.
- `current` — active guidance or state that may summarize an authority.
- `proposed` — not approved or implemented.
- `historical` — preserved evidence, not current instructions.
- `experimental` — usable only as a bounded experiment.
- `external` — owned outside the current project.

Capability evidence uses `verified`, `user_verified`, `documented`, `configured_unverified`, `unavailable`, or `proposed`. Configuration is never presented as proof that an integration is callable now.

## Extension rule

Add an adapter only when a real task cannot be completed through Composio, an existing repository, Codex/Work, Hermes, Agent Society, Buzz, or a mature external runtime. A new database, queue, dashboard, or wrapper requires separate approval.
