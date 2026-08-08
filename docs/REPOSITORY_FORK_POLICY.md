# Repository Fork Policy

Mansion uses a hybrid GitHub model: upstream links for normal use, `sincerityDocs` forks for intentional customization, and Mansion-owned adapters for our integration logic.

## Default: link upstream

Use the upstream URL and pinned commit in `registry/repositories.json`. Sol can inspect the repository through GitHub/Composio, while Codex, Work, Hermes, or Buzz can clone the selected commit when execution requires it.

Do not copy full source trees into Mansion. Do not add dozens of submodules merely to make repositories visible in one GitHub folder.

## Fork when customization begins

Immediately before the first intentional source change:

1. Create a fork under `sincerityDocs` using GitHub or Composio.
2. Preserve the original repository as the `upstream` remote.
3. Make the change on a branch rather than silently changing the default branch.
4. Preserve upstream attribution and license terms.
5. Update the Mansion catalog record:
   - set `integration_mode` to `fork`;
   - set `fork_url` to the `sincerityDocs` repository;
   - update `pinned_commit` to the selected fork commit when it becomes authoritative.
6. Keep Mansion-specific dispatch manifests or adapters in Mansion unless they genuinely belong in the forked project's source.

## Owned adapters

If upstream source needs no modification, keep it upstream-linked and store our thin integration contract under `integrations/<id>/`. An adapter should contain references, invocation boundaries, ownership, and credential rules—not a vendored copy of the repository.

## Updating an upstream link

Update a pinned commit deliberately when a project needs the newer version. The catalog pin records what Mansion selected; it is not an automatic claim that every runtime has installed or activated that revision.

## Exclusions

Incomplete or duplicate local checkouts are not catalog entries. The two `remotion.incomplete-*` folders remain excluded; Mansion links only the canonical Remotion upstream.
