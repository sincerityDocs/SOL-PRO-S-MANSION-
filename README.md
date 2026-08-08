# Sol Pro's Mansion

Sol Pro's Mansion is a lightweight shared front door for projects, durable state, and bounded agent handoffs. It lets Sol find the right source, documentation, execution environment, and latest state without loading an entire project history into Chat.

Mansion is intentionally simple: Markdown, JSON, Git, and stable pointers. It reuses Composio, project repositories, Google Drive, Codex, Work, Hermes, Agent Society, Buzz, and external runtimes instead of rebuilding them.

## Enter the Mansion

1. Read [`registry/projects.json`](registry/projects.json) or run `npm run resolve -- <project-id>`.
2. Read only that project's `STATE.md` and `pointers.json`.
3. Follow the minimum GitHub or Drive references needed for the active objective.
4. Act directly through Composio or delegate a bounded task using [`protocols/task-envelope.schema.json`](protocols/task-envelope.schema.json).
5. Persist substantial results in the authoritative repository, Drive, or artifact store.
6. Return a compact result using [`protocols/result-envelope.schema.json`](protocols/result-envelope.schema.json).
7. Update the project state pointer when the result changes what should happen next.

For Sol's complete operating instructions, start with [`docs/SOL_OPERATIONS.md`](docs/SOL_OPERATIONS.md).

## Registered projects

- `mansion` — this shared front door.
- `needle` — the Needle agent transaction project.
- `agent-society` — optional TERMINATOR mission-control infrastructure.

## Capability boundary

- Composio MCP owns Sol's native SaaS actions.
- GitHub repositories own source code and engineering history.
- Google Drive owns long-form human documents.
- Codex and Work own bounded execution and artifacts.
- Hermes owns optional reasoning, orchestration, projects, sessions, and local tools.
- Agent Society owns optional durable missions, approvals, artifacts, and handoffs.
- Buzz owns optional collaboration and external-runtime transport.

See [`registry/capabilities.json`](registry/capabilities.json) for evidence labels and current limitations.

## Repository library

[`registry/repositories.json`](registry/repositories.json) catalogs the existing capability repositories using their canonical upstream GitHub URLs and pinned commits. The catalog includes browser, scraping, research, media, automation, development, design, marketing, sales, trading, and agent-runtime resources without copying their source into Mansion.

- Browse the catalog first; load only the repository needed for the task.
- Keep upstream source linked until an intentional customization begins.
- Follow [`docs/REPOSITORY_FORK_POLICY.md`](docs/REPOSITORY_FORK_POLICY.md) before creating a `sincerityDocs` fork.
- Use [`integrations/buzz/`](integrations/buzz/) for Mansion's owned Buzz dispatch boundary.

## Validate the foundation

```text
npm install
npm run validate
npm run resolve -- mansion
```

The first proof is harmless and local. It validates repository references and handoff contracts without calling models or mutating external services.

## Security rule

Never store secrets in Mansion. Store capability handles, document IDs, paths, URLs, and artifact references only. Runtimes own their credentials.
