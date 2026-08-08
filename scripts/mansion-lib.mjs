import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";

export function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON ${filePath}: ${error.message}`);
  }
}

function insideRoot(root, relativePath) {
  if (typeof relativePath !== "string" || relativePath.length === 0) {
    throw new Error("Mansion path must be a non-empty string.");
  }
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(resolvedRoot, relativePath);
  const relationship = path.relative(resolvedRoot, resolvedPath);
  if (relationship.startsWith("..") || path.isAbsolute(relationship)) {
    throw new Error(`Mansion path escapes repository root: ${relativePath}`);
  }
  return resolvedPath;
}

function loadProtocolSchemas(root) {
  const protocolRoot = path.join(root, "protocols");
  return {
    reference: loadJson(path.join(protocolRoot, "artifact-reference.schema.json")),
    task: loadJson(path.join(protocolRoot, "task-envelope.schema.json")),
    result: loadJson(path.join(protocolRoot, "result-envelope.schema.json")),
  };
}

export function validateEnvelope(root, kind, value) {
  if (kind !== "task" && kind !== "result") {
    throw new Error(`Unknown envelope kind: ${kind}`);
  }
  const schemas = loadProtocolSchemas(root);
  const ajv = new Ajv({ allErrors: true, strict: true });
  ajv.addSchema(schemas.reference);
  const validate = ajv.compile(schemas[kind]);
  if (!validate(value)) {
    throw new Error(ajv.errorsText(validate.errors, { separator: "; " }));
  }
  return value;
}

export function loadProjectRegistry(root) {
  const registry = loadJson(path.join(root, "registry", "projects.json"));
  if (registry.contract_version !== "mansion.projects.v1" || !Array.isArray(registry.projects)) {
    throw new Error("Invalid Mansion project registry.");
  }
  const identifiers = new Set();
  for (const record of registry.projects) {
    for (const field of ["id", "name", "status", "evidence_state", "state_path", "pointers_path"] ) {
      if (typeof record?.[field] !== "string" || record[field].length === 0) {
        throw new Error(`Invalid project registry field ${field}.`);
      }
    }
    if (identifiers.has(record.id)) throw new Error(`Duplicate project ID: ${record.id}`);
    identifiers.add(record.id);
  }
  return registry;
}

export function resolveProject(root, id) {
  const registry = loadProjectRegistry(root);
  const project = registry.projects.find((entry) => entry.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);

  const stateFile = insideRoot(root, project.state_path);
  const pointersFile = insideRoot(root, project.pointers_path);
  if (!fs.existsSync(stateFile) || !fs.statSync(stateFile).isFile()) {
    throw new Error(`Missing state file for project: ${id}`);
  }
  if (!fs.existsSync(pointersFile) || !fs.statSync(pointersFile).isFile()) {
    throw new Error(`Missing pointers file for project: ${id}`);
  }

  const pointers = loadJson(pointersFile);
  if (pointers.project_id !== id || typeof pointers.authority !== "string") {
    throw new Error(`Invalid pointers file for project: ${id}`);
  }
  return { project, pointers };
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function resolveRepositoryFile(root, filePath) {
  const relativePath = path.isAbsolute(filePath) ? path.relative(root, filePath) : filePath;
  return insideRoot(root, relativePath);
}

export function recordRun(root, taskFile, resultFile) {
  const task = validateEnvelope(root, "task", loadJson(resolveRepositoryFile(root, taskFile)));
  const result = validateEnvelope(root, "result", loadJson(resolveRepositoryFile(root, resultFile)));
  if (result.task_id !== task.task_id || result.project_id !== task.project_id) {
    throw new Error("Result does not match its task.");
  }

  const registry = loadProjectRegistry(root);
  const project = registry.projects.find((entry) => entry.id === task.project_id);
  if (!project) throw new Error(`Unknown project: ${task.project_id}`);

  const destination = insideRoot(root, task.result_destination.uri);
  const runDirectory = path.dirname(destination);
  const taskDestination = path.join(runDirectory, "task.json");
  const pointersFile = insideRoot(root, project.pointers_path);
  const pointers = loadJson(pointersFile);
  if (!Array.isArray(pointers.drive)) throw new Error(`Invalid Drive pointers for project: ${task.project_id}`);

  const knownDriveUris = new Set(pointers.drive.map((reference) => reference.uri));
  let drivePointersAdded = 0;
  for (const reference of [...result.changes, ...result.artifacts, ...result.evidence]) {
    if (reference.kind !== "drive" || knownDriveUris.has(reference.uri)) continue;
    pointers.drive.push(reference);
    knownDriveUris.add(reference.uri);
    drivePointersAdded += 1;
  }

  project.last_meaningful_run = {
    kind: "artifact",
    uri: task.result_destination.uri,
    authority: "current",
    label: `${project.name} latest meaningful run`,
  };

  writeJson(taskDestination, task);
  writeJson(destination, result);
  writeJson(pointersFile, pointers);
  writeJson(path.join(root, "registry", "projects.json"), registry);

  return {
    taskId: task.task_id,
    projectId: task.project_id,
    runDirectory: path.relative(root, runDirectory).replaceAll(path.sep, "/"),
    drivePointersAdded,
  };
}

export function validateMansion(root) {
  const registry = loadProjectRegistry(root);
  for (const project of registry.projects) resolveProject(root, project.id);

  const capabilities = loadJson(path.join(root, "registry", "capabilities.json"));
  if (capabilities.contract_version !== "mansion.capabilities.v1" || !Array.isArray(capabilities.capabilities)) {
    throw new Error("Invalid Mansion capability registry.");
  }

  const proofRoot = path.join(root, "examples", "first-proof");
  const task = validateEnvelope(root, "task", loadJson(path.join(proofRoot, "task.json")));
  const result = validateEnvelope(root, "result", loadJson(path.join(proofRoot, "result.json")));
  if (!registry.projects.some((project) => project.id === task.project_id)) {
    throw new Error(`Proof references unknown project: ${task.project_id}`);
  }
  if (result.task_id !== task.task_id || result.project_id !== task.project_id) {
    throw new Error("First-proof result does not match its task.");
  }
  return { projectCount: registry.projects.length, capabilityCount: capabilities.capabilities.length };
}
