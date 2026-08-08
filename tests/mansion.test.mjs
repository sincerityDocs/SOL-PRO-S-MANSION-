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

test("records a completed run and registers its Drive pointers", () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mansion-record-"));
  try {
    for (const directory of ["registry", "projects", "protocols"]) {
      fs.cpSync(path.join(root, directory), path.join(temporaryRoot, directory), { recursive: true });
    }

    const incomingRoot = path.join(temporaryRoot, "incoming");
    fs.mkdirSync(incomingRoot, { recursive: true });
    const taskPath = path.join(incomingRoot, "task.json");
    const resultPath = path.join(incomingRoot, "result.json");
    const pointersPath = path.join(temporaryRoot, "projects", "needle", "pointers.json");
    const initialPointers = JSON.parse(fs.readFileSync(pointersPath, "utf8"));
    const initialDriveUris = initialPointers.drive.map((pointer) => pointer.uri);
    const driveFolder = {
      kind: "drive",
      uri: "https://drive.google.com/drive/folders/test-folder-id",
      authority: "current",
      label: "Sol Pro's Mansion folder",
    };
    const driveDocument = {
      kind: "drive",
      uri: "https://docs.google.com/document/d/test-document-id/edit",
      authority: "current",
      label: "Needle project brief",
    };

    fs.writeFileSync(taskPath, `${JSON.stringify({
      contract_version: "mansion.task.v1",
      task_id: "needle-drive-proof-test",
      project_id: "needle",
      objective: "Register a Drive-backed Needle project brief.",
      constraints: ["Use existing Composio connections."],
      inputs: [],
      references: [],
      allowed_actions: ["create_drive_folder", "create_google_doc", "record_mansion_pointers"],
      output_requirements: ["Return durable Drive references."],
      result_destination: {
        kind: "artifact",
        uri: "runs/needle-drive-proof-test/result.json",
        authority: "current",
        label: "Needle Drive proof result",
      },
    }, null, 2)}\n`);

    fs.writeFileSync(resultPath, `${JSON.stringify({
      contract_version: "mansion.result.v1",
      task_id: "needle-drive-proof-test",
      project_id: "needle",
      status: "completed",
      summary: "Created and registered a Drive-backed Needle project brief.",
      changes: [driveFolder],
      artifacts: [driveDocument],
      evidence: [driveDocument],
      warnings: [],
      next_actions: [],
    }, null, 2)}\n`);

    const result = run("record-run.mjs", [
      "--root", temporaryRoot,
      "--task", taskPath,
      "--result", resultPath,
    ]);
    assert.equal(result.status, 0, result.stderr);

    const recorded = JSON.parse(result.stdout);
    assert.equal(recorded.taskId, "needle-drive-proof-test");
    assert.equal(recorded.drivePointersAdded, 2);
    assert.equal(fs.existsSync(path.join(temporaryRoot, "runs", "needle-drive-proof-test", "task.json")), true);
    assert.equal(fs.existsSync(path.join(temporaryRoot, "runs", "needle-drive-proof-test", "result.json")), true);

    const registry = JSON.parse(fs.readFileSync(path.join(temporaryRoot, "registry", "projects.json"), "utf8"));
    const needle = registry.projects.find((project) => project.id === "needle");
    assert.equal(needle.last_meaningful_run.uri, "runs/needle-drive-proof-test/result.json");

    const pointers = JSON.parse(fs.readFileSync(pointersPath, "utf8"));
    assert.deepEqual(
      pointers.drive.map((pointer) => pointer.uri),
      [...initialDriveUris, driveFolder.uri, driveDocument.uri],
    );
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
