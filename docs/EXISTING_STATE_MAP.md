# Existing-State Map

Inspection date: 2026-08-08

This map records what was inspected before Mansion was created. Current source and live evidence override this snapshot.

| Component | Location | Purpose and observed state | Status | Recommendation |
| --- | --- | --- | --- | --- |
| Mansion repository | `https://github.com/sincerityDocs/SOL-PRO-S-MANSION-` | New GitHub front door; initially contained only a README. | authoritative | KEEP and use as Sol's entry point. |
| Agent Society front door | `C:/dev/Agent-Society` | Junction-based map to the canonical dashboard, knowledge vault, and shared runtime. Its README clearly separates current and retired material. | current local navigation | KEEP; link rather than copy. |
| Agent Society implementation | `C:/dev/terminator-dashboard` | Next.js/TypeScript/Prisma control plane with missions, runs, artifacts, approvals, handoffs, connectors, and Codex launch support. The worktree contained substantial intentional changes. Dashboard, worker, Docker, and PostgreSQL were offline during inspection. No Git remote was configured. | authoritative source; runtime unavailable | ADAPT only when a task needs its control plane. Do not make it Mansion's required front door. |
| Agent Society knowledge | Obsidian vault referenced by `C:/dev/Agent-Society/README.md` | Canonical governance and organizational knowledge, with current-document indexing in the dashboard. | authoritative local knowledge | KEEP; reference specific documents. |
| Shared runtime storage | `C:/dev/terminator-shared` | Local credentials and logs shared by Agent Society components. | secret-bearing local state | KEEP isolated; never copy into Mansion. |
| Hermes | `C:/Users/dansh/AppData/Local/hermes` | CLI, running gateway, four active sessions, project registry, kanban, MCP support, skills, local databases, and optional platform integrations were observed. | verified locally | KEEP as optional orchestration and local execution. Expose handles, not secrets. |
| Composio | Native MCP in Sol Chat; CLI installed in WSL | Sol's full required tool access was user-verified in Chat. The local CLI was authenticated, but its developer connected-account inventory was not reconfigured for this repository. | user verified in Sol | KEEP as the preferred SaaS action layer; do not build wrappers. |
| Needle | `https://github.com/sincerityDocs/Needle` and `C:/dev/needle/source` | Active Git repository with its own architecture, handoffs, release evidence, and Sites identity. | authoritative project repository | KEEP independent; Mansion stores resume pointers only. |
| Buzz | Agent Society bridge and deployment material under `C:/dev/terminator-dashboard` | Collaboration and external-runtime interface material exists. Live availability was not re-proven for this milestone. | configured, unverified now | ADAPT later as optional icing when a real capability gap requires it. |
| External capability repositories | `C:/dev/agent-society-repos` | Candidate browser, scraping, media, automation, and agent repositories. Presence does not make them installed or callable. | experimental source pool | KEEP as references; investigate and activate only per task. |
| Google Drive | Sol's Composio MCP surface | Intended home for long-form human documentation; access was user-verified through Sol. No Mansion document IDs are registered yet. | user verified; pointers empty | KEEP as document authority. Add links naturally as projects use it. |

## Reassessment of Agent Society

Agent Society originally needed to provide orchestration, durable missions, agent/tool coordination, connectors, approvals, artifacts, and knowledge promotion. Today, Sol, Composio, Codex/Work, GitHub, Drive, and Hermes already cover much of the user-facing reasoning, SaaS access, repository execution, durable content, and optional local orchestration.

The remaining useful Agent Society layer is a control plane for missions that genuinely need durable runs, approvals, recovery, evidence, and cross-department coordination. It should not be duplicated inside Mansion or required for ordinary project navigation.
