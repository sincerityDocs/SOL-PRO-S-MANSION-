import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(script, args = []) {
  return spawnSync(process.execPath, [path.join(root, "scripts", script), ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("resolver returns the Mansion project without loading project history", () => {
  const result = run("resolve-project.mjs", ["mansion"]);
  assert.equal(result.status, 0, result.stderr);
  const resolved = JSON.parse(result.stdout);
  assert.equal(resolved.project.id, "mansion");
  assert.equal(resolved.project.state_path, "projects/mansion/STATE.md");
  assert.equal(resolved.pointers.authority, "mansion");
});

test("resolver refuses an unknown project ID", () => {
  const result = run("resolve-project.mjs", ["missing"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown project: missing/);
});

test("repository validator accepts the committed first proof", () => {
  const result = run("validate-mansion.mjs");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Mansion valid: 3 projects, first proof accepted\./);
});

test("repository validator rejects an unknown task-envelope field", () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mansion-contract-"));
  try {
    for (const directory of ["registry", "projects", "protocols", "examples"]) {
      fs.cpSync(path.join(root, directory), path.join(temporaryRoot, directory), { recursive: true });
    }
    const taskPath = path.join(temporaryRoot, "examples", "first-proof", "task.json");
    const task = JSON.parse(fs.readFileSync(taskPath, "utf8"));
    task.unexpected = true;
    fs.writeFileSync(taskPath, `${JSON.stringify(task, null, 2)}\n`);

    const result = run("validate-mansion.mjs", ["--root", temporaryRoot]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /must NOT have additional properties/);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
