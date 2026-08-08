import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMansion } from "./mansion-lib.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rootFlag = process.argv.indexOf("--root");
const root = rootFlag >= 0 ? path.resolve(process.argv[rootFlag + 1] ?? "") : repositoryRoot;

try {
  if (rootFlag >= 0 && !process.argv[rootFlag + 1]) throw new Error("--root requires a path.");
  const result = validateMansion(root);
  console.log(`Mansion valid: ${result.projectCount} projects, first proof accepted.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
