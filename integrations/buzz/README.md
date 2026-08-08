# Buzz Integration

Buzz is Mansion's optional collaboration and evidence transport. Its upstream source remains at [`block/buzz`](https://github.com/block/buzz); Mansion owns the integration contract, not a copy of Buzz.

## Responsibilities

- Sol chooses the project and objective.
- Hermes owns reasoning, delegation, synthesis, and escalation.
- Buzz carries collaboration messages and evidence.
- Agent OS/PostgreSQL may own durable mission state when that control plane is used.
- Mansion supplies compact task/result contracts and project pointers.
- The runtime owns endpoints and credentials.

## Dispatch shape

```text
Mansion project + active objective
  -> mansion.task.v1 with bounded references
  -> Hermes selects the route
  -> Buzz transports collaboration/evidence
  -> worker or external repository produces an artifact
  -> mansion.result.v1 returns summary, evidence, and pointers
```

The invoking runtime resolves current availability. The GitHub manifest deliberately contains no endpoint URL, token, or credential value.

## Existing implementation pointers

The current Agent Society bridge remains in the canonical local implementation:

- `C:/dev/terminator-dashboard/lib/runtime/buzz-bridge.ts`
- `C:/dev/terminator-dashboard/lib/integrations/buzz.ts`
- `C:/dev/terminator-dashboard/deploy/buzz`

Mansion references these files instead of copying them.

## Source changes

Do not fork Buzz merely to use it. If a future task requires an intentional change to Buzz's own source, follow [`docs/REPOSITORY_FORK_POLICY.md`](../../docs/REPOSITORY_FORK_POLICY.md), create the `sincerityDocs` fork first, and update both `registry/repositories.json` and `manifest.json` with the fork URL and selected commit.
