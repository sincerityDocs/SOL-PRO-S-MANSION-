# Hybrid Repository Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Buzz and capability repositories discoverable through Mansion while preserving upstream ownership and forking only when intentional customization begins.

**Architecture:** A static GitHub repository catalog records upstream URLs, branches, pinned commits, capability categories, repository forms, and intended consumers. Mansion owns a Buzz integration manifest and fork policy; external source remains upstream until a real source change requires a `sincerityDocs` fork.

**Tech Stack:** JSON, Markdown, Git, existing Mansion Node.js resolver.

## Global Constraints

- Do not copy external repository source trees into Mansion.
- Do not add nested Git repositories or bulk submodules.
- Exclude `remotion.incomplete-20260806-215518` and `remotion.incomplete-20260806-221844`.
- Do not activate or execute Buzz or candidate repositories.
- Do not publish secrets, endpoint credentials, or credential-bearing URLs.
- Keep repository presence separate from runtime readiness and authorization.

---

### Task 1: Canonical upstream repository catalog

**Files:**
- Create: `registry/repositories.json`

**Interfaces:**
- Consumes: upstream URL, default branch, pinned commit, and local path observed from `C:/dev/agent-society-repos`.
- Produces: `mansion.repositories.v1` with stable records consumable by Sol, Codex, Work, Hermes, and Buzz.

- [ ] **Step 1: Add the catalog contract header**

```json
{
  "contract_version": "mansion.repositories.v1",
  "fork_policy": "fork_on_first_intentional_source_change",
  "repositories": []
}
```

- [ ] **Step 2: Add one canonical record for each upstream**

Each record must contain exactly these fields:

```json
{
  "id": "browser-use",
  "name": "Browser Use",
  "upstream_url": "https://github.com/browser-use/browser-use",
  "default_branch": "main",
  "pinned_commit": "32601887cfbc9f4f1e3cad3e2b678e56aeaeaae4",
  "local_checkout": "C:/dev/agent-society-repos/browser-use",
  "repository_form": "runtime",
  "capability_categories": ["browser", "automation"],
  "integration_mode": "upstream_link",
  "fork_url": null,
  "intended_consumers": ["sol", "hermes", "buzz"]
}
```

- [ ] **Step 3: Confirm duplicate IDs and incomplete Remotion folders are absent**

Run a Node.js JSON parse that asserts every ID is unique, every pin is a 40-character hexadecimal commit, and neither incomplete Remotion folder appears.

### Task 2: Mansion-owned Buzz integration contract

**Files:**
- Create: `integrations/buzz/manifest.json`
- Create: `integrations/buzz/README.md`
- Create: `docs/REPOSITORY_FORK_POLICY.md`
- Modify: `registry/capabilities.json`

**Interfaces:**
- Consumes: `mansion.task.v1`, `mansion.result.v1`, the upstream Buzz record, and existing Agent Society bridge locations.
- Produces: `mansion.integration.v1` describing ownership, dispatch boundaries, and fork behavior without exposing runtime secrets.

- [ ] **Step 1: Add the Buzz manifest**

The manifest must identify `block/buzz` at commit `769ac70b741e3ad6809bff14eba29d3dd2cbd318`, assign orchestration to Hermes, collaboration/evidence transport to Buzz, optional mission authority to Agent OS/PostgreSQL, and credentials to the runtime.

- [ ] **Step 2: Document how Sol uses Buzz**

Describe repository discovery, bounded task dispatch, compact result return, existing local bridge pointers, and the rule that current availability is resolved at invocation time.

- [ ] **Step 3: Document fork-on-change operations**

Give the exact ownership decision: keep upstream links until customization begins; then create a `sincerityDocs` fork, preserve the upstream remote, work on a branch, and update Mansion's fork URL and pin.

- [ ] **Step 4: Point the capability registry to the new catalog and manifest**

Update the existing `buzz` and `external-repositories` records without changing their evidence claims into runtime guarantees.

### Task 3: Sol front door and publication

**Files:**
- Modify: `README.md`
- Modify: `docs/SOL_OPERATIONS.md`

**Interfaces:**
- Consumes: repository catalog, Buzz manifest, and fork policy.
- Produces: concise instructions for selecting and customizing external capabilities.

- [ ] **Step 1: Add repository discovery to the README**

Link `registry/repositories.json`, `integrations/buzz/`, and `docs/REPOSITORY_FORK_POLICY.md` from the front door.

- [ ] **Step 2: Add the Sol selection flow**

Instruct Sol to select an upstream record, load only the needed source, use the smallest execution room, and fork only before intentional source modification.

- [ ] **Step 3: Run one static catalog check**

Run: `node -e "const fs=require('fs'); for (const f of ['registry/repositories.json','integrations/buzz/manifest.json']) JSON.parse(fs.readFileSync(f,'utf8')); console.log('repository integration json valid')"`

Expected: `repository integration json valid`

- [ ] **Step 4: Run the Mansion resolver happy path**

Run: `npm run resolve -- mansion`

Expected: successful JSON output for the Mansion project.

- [ ] **Step 5: Commit and publish**

```text
git add registry integrations docs README.md
git commit -m "feat: integrate upstream capability catalog"
git push origin codex/mansion-foundation
```
