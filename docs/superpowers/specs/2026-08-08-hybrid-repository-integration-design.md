# Hybrid Repository Integration Design

## Purpose

Integrate the existing Buzz and capability-repository collection into Sol Pro's Mansion through GitHub-native references without copying large source trees, creating unnecessary forks, or making Mansion a monorepo.

## Integration model

Mansion will catalog each canonical upstream repository using its real GitHub URL, default branch, and a pinned commit observed from the existing local checkout. The two incomplete Remotion duplicate folders are excluded. The canonical Remotion upstream remains cataloged using its current upstream `main` commit because the local `remotion` checkout has no commit.

Existing local clones are evidence sources for the catalog. They are not copied into Mansion, added as nested repositories, or converted into dozens of submodules. Sol can reach the upstream repositories directly through GitHub and Composio; Codex, Work, Hermes, or Buzz can clone a pinned repository when execution actually requires it.

## Repository catalog

`registry/repositories.json` will contain one record per canonical upstream with:

- stable Mansion ID and display name;
- upstream GitHub URL;
- default branch and pinned commit;
- local checkout path when present;
- capability categories;
- repository form such as skill, reference, library, templates, application, service, or runtime;
- integration mode: initially `upstream_link`;
- optional `fork_url`, initially `null`;
- intended consumers such as Sol, Codex, Work, Hermes, or Buzz.

Catalog presence means discoverable source, not guaranteed live runtime availability. Readiness and authorization remain runtime decisions.

## Hybrid fork policy

1. Link the upstream repository by default.
2. Create a `sincerityDocs` fork immediately before the first intentional source change.
3. Keep the original repository configured as the fork's `upstream` remote.
4. Make custom changes on branches and preserve upstream attribution and license terms.
5. Record the fork URL and selected commit in Mansion after the fork exists.
6. Keep Mansion-owned manifests and adapters in Mansion or another explicitly owned repository rather than patching upstream code unnecessarily.

## Buzz integration

Buzz remains upstream-linked to `https://github.com/block/buzz`. Mansion owns `integrations/buzz/manifest.json` and `integrations/buzz/README.md`, which define:

- upstream repository and pinned commit;
- Buzz's role as collaboration and evidence transport;
- Hermes as orchestrator;
- Agent OS/PostgreSQL as optional mission authority;
- Mansion task/result contracts;
- runtime-owned credential handling;
- pointers to the existing local Agent Society bridge and deployment material;
- fork-on-first-Buzz-source-change behavior.

No endpoint URLs, tokens, secrets, or credential values belong in these files.

## Documentation updates

The Mansion README and Sol operating guide will explain how to discover a repository, choose an upstream link, create a fork only when customization begins, and delegate execution through the smallest suitable room.

## Verification

Perform one lightweight static parse of the new JSON catalog and Buzz manifest, then run the existing Mansion project resolver once. This milestone does not activate Buzz, execute candidate repositories, repeat safety proofs, or validate each upstream project.
