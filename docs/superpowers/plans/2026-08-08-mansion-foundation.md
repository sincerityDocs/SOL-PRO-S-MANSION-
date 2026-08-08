# Sol Pro Mansion Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish the smallest GitHub-native Mansion foundation that resolves projects and validates compact task/result handoffs without duplicating existing runtimes.

**Architecture:** JSON registries and strict JSON Schemas form the machine-facing contract; short Markdown files form the human-facing entry points. Small Node.js scripts validate the repository and resolve a project using only committed references, while Composio, Hermes, Agent Society, Buzz, Codex, Work, Drive, and project repositories retain their existing responsibilities.

**Tech Stack:** Node.js 20+, ECMAScript modules, JSON Schema draft-07, Ajv 8, Markdown, Git.

## Global Constraints

- Do not store credentials, secret values, or credential-bearing URLs.
- Do not modify Agent Society, Needle, Hermes, Buzz, Drive, or Composio state.
- Represent unavailable or unverified capabilities truthfully.
- Keep substantial project history outside model handoffs; store references instead.
- Run one repository validation and one resolver happy path for final verification.

---

### Task 1: Strict envelope contracts and validator library

**Files:**
- Create: `package.json`
- Create: `protocols/artifact-reference.schema.json`
- Create: `protocols/task-envelope.schema.json`
- Create: `protocols/result-envelope.schema.json`
- Create: `scripts/mansion-lib.mjs`
- Create: `tests/mansion.test.mjs`

**Interfaces:**
- Produces: `loadJson(path)`, `validateEnvelope(root, kind, value)`, and `resolveProject(root, id)` from `scripts/mansion-lib.mjs`.
- Consumes: JSON documents rooted at the repository directory.

- [ ] **Step 1: Write failing envelope validation tests**

```js
test("accepts a bounded task envelope", () => {
  assert.doesNotThrow(() => validateEnvelope(root, "task", task));
});

test("rejects unknown task fields", () => {
  assert.throws(() => validateEnvelope(root, "task", { ...task, secret: "no" }), /must NOT have additional properties/);
});
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `node --test tests/mansion.test.mjs`

Expected: FAIL because `scripts/mansion-lib.mjs` and the protocol schemas do not exist.

- [ ] **Step 3: Add the package and strict contracts**

Use an ESM package with `ajv` as the only dependency and scripts named `test`, `validate`, and `resolve`. Define `mansion.artifact-reference.v1`, `mansion.task.v1`, and `mansion.result.v1` schemas with `additionalProperties: false`, required project/task IDs, bounded strings/arrays, and artifact references instead of embedded large payloads.

- [ ] **Step 4: Implement validation helpers**

```js
export function validateEnvelope(root, kind, value) {
  const schemas = loadProtocolSchemas(root);
  const ajv = new Ajv({ allErrors: true, strict: true });
  ajv.addSchema(schemas.reference);
  const validate = ajv.compile(schemas[kind]);
  if (!validate(value)) throw new Error(ajv.errorsText(validate.errors, { separator: "; " }));
  return value;
}
```

- [ ] **Step 5: Run the focused tests and confirm they pass**

Run: `node --test tests/mansion.test.mjs`

Expected: PASS for valid envelopes and strict rejection of unknown fields.

- [ ] **Step 6: Commit the contract layer**

```text
git add package.json package-lock.json protocols scripts/mansion-lib.mjs tests/mansion.test.mjs
git commit -m "feat: add mansion handoff contracts"
```

### Task 2: Project and capability registries with resolver

**Files:**
- Create: `registry/projects.json`
- Create: `registry/capabilities.json`
- Create: `projects/mansion/PROJECT.md`
- Create: `projects/mansion/STATE.md`
- Create: `projects/mansion/pointers.json`
- Create: `projects/needle/PROJECT.md`
- Create: `projects/needle/STATE.md`
- Create: `projects/needle/pointers.json`
- Create: `projects/agent-society/PROJECT.md`
- Create: `projects/agent-society/STATE.md`
- Create: `projects/agent-society/pointers.json`
- Create: `scripts/resolve-project.mjs`
- Modify: `scripts/mansion-lib.mjs`
- Modify: `tests/mansion.test.mjs`

**Interfaces:**
- Consumes: `registry/projects.json` records with `id`, `state_path`, and `pointers_path`.
- Produces: `resolveProject(root, id)` returning the selected registry record plus parsed pointers; CLI prints that object as JSON.

- [ ] **Step 1: Add failing resolver tests**

```js
test("resolves Mansion without loading project history", () => {
  const project = resolveProject(root, "mansion");
  assert.equal(project.record.id, "mansion");
  assert.equal(project.pointers.authority, "mansion");
});

test("rejects an unknown project ID", () => {
  assert.throws(() => resolveProject(root, "missing"), /Unknown project/);
});
```

- [ ] **Step 2: Run the tests and confirm resolver failure**

Run: `node --test tests/mansion.test.mjs`

Expected: FAIL because the registries and project state files do not exist.

- [ ] **Step 3: Add evidence-labeled registry records**

Register `mansion`, `needle`, and `agent-society`. Use the known Mansion and Needle GitHub repositories, label Agent Society's source as local-only because no Git remote is configured, and distinguish `verified`, `user_verified`, `documented`, and `configured_unverified` capabilities.

- [ ] **Step 4: Implement safe project resolution**

```js
export function resolveProject(root, id) {
  const registry = loadJson(path.join(root, "registry", "projects.json"));
  const record = registry.projects.find((entry) => entry.id === id);
  if (!record) throw new Error(`Unknown project: ${id}`);
  const statePath = insideRoot(root, record.state_path);
  const pointersPath = insideRoot(root, record.pointers_path);
  if (!fs.existsSync(statePath) || !fs.existsSync(pointersPath)) throw new Error(`Incomplete project record: ${id}`);
  return { record, statePath, pointers: loadJson(pointersPath) };
}
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `node --test tests/mansion.test.mjs`

Expected: PASS for registered project resolution and unknown-ID refusal.

- [ ] **Step 6: Commit the registry layer**

```text
git add registry projects scripts tests
git commit -m "feat: add mansion project registry"
```

### Task 3: Operating guide and first proof

**Files:**
- Modify: `README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/EXISTING_STATE_MAP.md`
- Create: `docs/SOL_OPERATIONS.md`
- Create: `examples/first-proof/task.json`
- Create: `examples/first-proof/result.json`
- Create: `scripts/validate-mansion.mjs`

**Interfaces:**
- Consumes: all registry records, project files, protocol schemas, and proof envelopes.
- Produces: a zero-exit repository validator and concise operating instructions for future Sol sessions.

- [ ] **Step 1: Add the bounded first-proof envelopes**

The task asks the Mansion to resolve itself and validate its front door. The completed result references the registry, state file, protocol schemas, and validation evidence without embedding their contents.

- [ ] **Step 2: Implement the repository validator**

```js
for (const project of registry.projects) resolveProject(root, project.id);
validateEnvelope(root, "task", loadJson(proofTask));
validateEnvelope(root, "result", loadJson(proofResult));
console.log(`Mansion valid: ${registry.projects.length} projects, first proof accepted.`);
```

- [ ] **Step 3: Write the human front door and operating documents**

Document the evidence-backed existing-state map, ownership boundaries, seven-step Sol workflow, credential rules, authority labels, compact handoff practice, and exact resolver/validator commands. Keep Drive and Composio as native capabilities rather than local integrations.

- [ ] **Step 4: Run final repository validation**

Run: `npm run validate`

Expected: `Mansion valid: 3 projects, first proof accepted.`

- [ ] **Step 5: Run the resolver happy path**

Run: `npm run resolve -- mansion`

Expected: JSON identifying the Mansion repository, its state file, pointers, orchestrator, and execution preferences.

- [ ] **Step 6: Commit and publish**

```text
git add README.md docs examples scripts/validate-mansion.mjs
git commit -m "docs: open the sol mansion front door"
git push -u origin codex/mansion-foundation
```
