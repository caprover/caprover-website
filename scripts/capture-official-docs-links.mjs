import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { writeJson } from "./docs-redirects.mjs";
const inputs = process.argv.slice(2);
if (inputs.length !== 5)
  throw new Error(
    "Pass website, caprover, caprover-cli, one-click-apps, and deploy-from-github checkout directories",
  );
const repositories = [
  "caprover/caprover-website",
  "caprover/caprover",
  "caprover/caprover-cli",
  "caprover/one-click-apps",
  "caprover/deploy-from-github",
];
const references = [],
  exclusions = [],
  revisions = {};
for (const [index, directory] of inputs.entries()) {
  const repository = repositories[index];
  revisions[repository] = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: directory,
    encoding: "utf8",
  }).trim();
  const files = execFileSync("git", ["ls-files", "-z"], {
    cwd: directory,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
  for (const file of files) {
    // Audit shipped sources and docs; ignore generated compatibility inventories and test fixtures.
    if (
      /^(?:docs-compat\/|scripts\/|DOCS_|docs-site\/package-lock|marketing-site\/package-lock)/.test(
        file,
      ) &&
      index === 0
    )
      continue;
    const text = await readFile(path.join(directory, file), "utf8");
    if (text.includes("\0")) continue;
    for (const [line, value] of text.split("\n").entries()) {
      const pattern =
        /(?:https?:\/\/caprover\.com|(?<=[("']))\/(?:docs(?:-next)?\/|(?:es-ES|zh-CN)\/docs\/)[^\s<>"'`)\]}]+/g;
      for (const match of value.matchAll(pattern)) {
        const url = new URL(match[0], "https://caprover.com");
        const ref = { repository, file, line: line + 1, url: url.href };
        if (url.pathname.includes("..."))
          exclusions.push({
            ...ref,
            reason: "Illustrative placeholder, not a published page link.",
          });
        else references.push(ref);
      }
    }
  }
}
await writeJson("docs-compat/official-links.json", {
  version: 1,
  revisions,
  scope:
    "Tracked text in current official checkouts. Website excludes generated compatibility data and validation fixtures. Root-relative public documentation links included. Git history and every release note revision are outside this bounded scan.",
  exclusions,
  references,
});
console.log("Captured " + references.length + " official references");
