# Mansion Run Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record one completed Sol task as durable Mansion state and register its returned Drive references.

**Architecture:** A small Node.js command validates existing v1 envelopes, copies them to the task's declared run directory, updates the registered project's last meaningful run, and adds new Drive references to its pointer file. Composio remains the external action layer.

**Tech Stack:** Node.js 20+, built-in filesystem APIs, AJV, Node test runner

## Global Constraints

- Do not store or print OAuth credentials.
- Do not merge or modify `sol/needle-resume-proof`.
- Do not add a workflow platform or Google client dependency.
- Perform one live Needle Drive proof after the local behavior passes.

---

### Task 1: Durable run recorder

**Files:**
- Modify: `tests/mansion.test.mjs`
- Modify: `scripts/mansion-lib.mjs`
- Create: `scripts/record-run.mjs`
- Modify: `package.json`
- Modify: `docs/SOL_OPERATIONS.md`

**Interfaces:**
- Consumes: `recordRun(root, taskFile, resultFile)` with valid task/result JSON files.
- Produces: `{ taskId, projectId, runDirectory, drivePointersAdded }` and updated repository JSON.

- [ ] **Step 1: Write the failing behavior test**

Add a test that records a Needle task/result in a temporary Mansion copy and asserts that the run files, project registry pointer, and deduplicated Drive pointer are written.

- [ ] **Step 2: Run the test and verify the expected failure**

Run: `node --test tests/mansion.test.mjs --test-name-pattern="records a completed run"`

Expected: FAIL because `scripts/record-run.mjs` does not exist.

- [ ] **Step 3: Implement the minimal recorder**

Export `recordRun` from `scripts/mansion-lib.mjs`, add the thin CLI in `scripts/record-run.mjs`, expose it as `npm run record`, and document the command after the existing resolve/validate helpers.

- [ ] **Step 4: Run the focused test and existing suite**

Run: `node --test tests/mansion.test.mjs --test-name-pattern="records a completed run"`, then `npm test`.

Expected: focused test passes, then all tests pass.

- [ ] **Step 5: Commit the automation**

Commit the test, implementation, package script, operating-guide update, design, and plan as `feat: record durable Mansion runs`.

### Task 2: Live Needle Drive proof

**Files:**
- Create: `runs/needle-drive-proof-2026-08-08/task.json`
- Create: `runs/needle-drive-proof-2026-08-08/result.json`
- Modify: `projects/needle/pointers.json` through the recorder
- Modify: `registry/projects.json` through the recorder

**Interfaces:**
- Consumes: verified folder/document IDs returned by Composio.
- Produces: a durable Needle run and resolvable Drive pointers.

- [ ] **Step 1: Find or create the Mansion Drive folder and create the Needle brief**

Use Composio's existing Google Drive and Google Docs connections. Capture returned IDs without storing credentials.

- [ ] **Step 2: Create matching bounded task/result envelopes**

The task permits only folder/document creation and Mansion pointer recording. The result references the created Drive artifacts.

- [ ] **Step 3: Record the live run**

Run: `npm run record -- --task runs/needle-drive-proof-2026-08-08/task.json --result runs/needle-drive-proof-2026-08-08/result.json`

Expected: the Needle registry record and pointer file reference the durable run and Drive artifacts.

- [ ] **Step 4: Perform the lightweight acceptance check**

Run: `npm run validate` and `npm run resolve -- needle`.

Expected: validation succeeds and Needle resolves with non-empty Drive pointers and the new last meaningful run.

- [ ] **Step 5: Commit and publish the review branch**

Commit as `feat: register Needle Drive proof` and push `codex/mansion-automation`. Do not merge Sol's proof branch.
