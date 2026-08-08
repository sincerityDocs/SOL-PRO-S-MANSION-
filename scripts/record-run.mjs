import path from "node:path";
import { fileURLToPath } from "node:url";
import { recordRun } from "./mansion-lib.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function flagValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

try {
  const rootValue = flagValue("--root");
  const taskFile = flagValue("--task");
  const resultFile = flagValue("--result");
  if (!taskFile || !resultFile) {
    throw new Error("Usage: npm run record -- --task <task.json> --result <result.json>");
  }
  const root = rootValue ? path.resolve(rootValue) : repositoryRoot;
  console.log(JSON.stringify(recordRun(root, taskFile, resultFile), null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
