import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveProject } from "./mansion-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectId = process.argv[2];

try {
  if (!projectId) throw new Error("Usage: npm run resolve -- <project-id>");
  console.log(JSON.stringify(resolveProject(root, projectId), null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
