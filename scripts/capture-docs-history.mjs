// Reproduce with two rendered builds; see DOCS_LEGACY_LINK_AUDIT.md.
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  contentIds,
  normalizeRoute,
  readJson,
  writeJson,
} from "./docs-redirects.mjs";
const baseline = path.resolve(
  process.argv[2] ?? "../caprover-website-baseline",
);
const catalog = await readJson("DOCS_CONSOLIDATION_MAP.json");
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: baseline,
  encoding: "utf8",
}).trim();
if (revision !== catalog.baseCommit)
  throw new Error("Incorrect baseline worktree revision");
const locales = (await readJson("content/locales.json")).filter(
  (l) => l.enabled,
);
const pages = {};
const manualRevision = execFileSync("git", ["rev-parse", "f0b3079"], {
  encoding: "utf8",
}).trim();
// This addendum was published after baseCommit. Its English Markdown is byte-identical
// to the current source, so the current render provides its historical IDs.
const manualSource = execFileSync(
  "git",
  ["show", manualRevision + ":content/en/docs-next/installation/manual.md"],
  { encoding: "utf8" },
);
if (
  manualSource !==
  (await readFile("content/en/docs-next/installation/manual.md", "utf8"))
)
  throw new Error("Manual Setup changed; rebuild its historical revision");
const manualIds = contentIds(
  await readFile("docs-site/build/docs/installation/manual.html", "utf8"),
);
for (const locale of locales) {
  for (const old of catalog.legacyEnglishRoutes) {
    const route = locale.pathPrefix + old.legacy;
    const file =
      "docs-site/build" +
      locale.pathPrefix +
      old.legacy.replace("/docs/", "/docs-legacy/") +
      ".html";
    pages[route] = {
      kind: "legacy",
      ids: contentIds(await readFile(file, "utf8")),
    };
  }
  pages[locale.pathPrefix + "/docs-next/installation/manual"] = {
    kind: "preview",
    ids: manualIds,
  };
  for (const old of catalog.previewRoutes) {
    const route = normalizeRoute(locale.pathPrefix + old.from);
    const file = path.join(baseline, "docs-site/build" + route + ".html");
    pages[route] = {
      kind: "preview",
      ids: contentIds(await readFile(file, "utf8")),
    };
  }
}
await writeJson("docs-compat/historical-anchors.json", {
  version: 1,
  previewRevision: revision,
  manualRevision,
  legacyRevision: execFileSync("git", ["rev-parse", "master"], {
    encoding: "utf8",
  }).trim(),
  provenance:
    "Rendered Docusaurus article IDs. Preview: baseCommit worktree build (all locales; localized preview originally used English fallback). Legacy: preserved archive build. Manual Setup addendum: current rendered English IDs, verified byte-identical source at manualRevision; localized previews used English fallback.",
  pages: Object.fromEntries(
    Object.entries(pages).sort(([a], [b]) => a.localeCompare(b, "en")),
  ),
});
console.log("Captured " + Object.keys(pages).length + " historical documents");
