import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import {
  buildManifest,
  contentIds,
  documentMetadata,
  htmlFile,
  normalizeRoute,
  readJson,
  resolveRedirect,
  routeCatalog,
  variants,
  writeJson,
} from "./docs-redirects.mjs";

const site = path.resolve("build/combined-site");
const catalog = await readJson("DOCS_CONSOLIDATION_MAP.json");
const locales = (await readJson("content/locales.json")).filter(
  (l) => l.enabled,
);
const history = await readJson("docs-compat/historical-anchors.json");
assert.equal(history.previewRevision, catalog.baseCommit);
const routes = routeCatalog(catalog, locales);
assert.equal(
  routes.filter((r) => r.kind === "legacy").length,
  36 * locales.length,
);
assert.equal(
  routes.filter((r) => r.kind === "preview").length,
  142 * locales.length,
);
assert.equal(Object.keys(history.pages).length, 178 * locales.length);
assert.deepEqual(
  Object.keys(history.pages).sort(),
  [...new Set(routes.map((r) => r.evidence))].sort(),
  "Historical evidence must cover every source exactly once",
);
for (const page of Object.values(history.pages))
  assert.deepEqual(
    page.ids,
    [...new Set(page.ids)].sort(),
    "Historical IDs must be unique and sorted",
  );
const inventory = {
  version: 1,
  previewRevision: catalog.baseCommit,
  variants: ["extensionless", "trailing-slash", ".html", "/index.html"],
  routes: routes.map(({ source, kind, locale, evidence, canonical }) => ({
    source,
    kind,
    locale,
    evidence,
    canonical,
  })),
};
if (process.argv.includes("--capture-routes"))
  await writeJson("docs-compat/historical-routes.json", inventory);
assert.deepEqual(
  await readJson("docs-compat/historical-routes.json"),
  inventory,
  "Historical route inventory changed; review compatibility before recapturing",
);
const manifest = await readJson(path.join(site, "docs-redirect-manifest.json"));
assert.deepEqual(
  manifest,
  await buildManifest(process.cwd(), path.resolve("docs-site/build")),
  "Stale assembled manifest",
);
const canonical = new Set(
  catalog.sections.flatMap((s) =>
    s.pages.flatMap((p) =>
      locales.map(
        (l) => l.pathPrefix + "/docs/" + p.target.replace(/\/index$/, ""),
      ),
    ),
  ),
);
const cache = new Map();
const idCache = new Map();
const metadataCache = new Map();
async function ids(route) {
  const key = normalizeRoute(new URL(route, "https://caprover.com").pathname);
  if (!idCache.has(key)) idCache.set(key, contentIds(await document(key)));
  return idCache.get(key);
}
async function document(route) {
  const file = htmlFile(site, route);
  if (!cache.has(file)) cache.set(file, await readFile(file, "utf8"));
  return cache.get(file);
}
async function validateTarget(target, locale) {
  const url = new URL(target, "https://caprover.com");
  const html = await document(url.pathname);
  const archive = url.pathname.includes("/docs-legacy/");
  assert(
    archive || canonical.has(url.pathname),
    "Destination is another redirect: " + target,
  );
  if (!metadataCache.has(url.pathname))
    metadataCache.set(url.pathname, documentMetadata(html));
  const metadata = metadataCache.get(url.pathname);
  assert.equal(metadata.language, locale);
  if (url.hash)
    assert(
      (await ids(url.pathname)).includes(decodeURIComponent(url.hash.slice(1))),
      "Missing final fragment: " + target,
    );
  if (archive) assert.equal(metadata.robots, "noindex, nofollow");
  else
    assert.deepEqual(
      metadata.canonical,
      ["https://caprover.com" + url.pathname],
      "Incorrect canonical: " + target,
    );
}
let routeVariants = 0,
  fragmentVariants = 0,
  archiveFallbacks = 0,
  currentAnchors = 0;
const policyCounts = {};
for (const entry of manifest.routes) {
  const historical = history.pages[entry.evidence];
  if (entry.archive) {
    assert.deepEqual(
      await ids(entry.archive),
      historical.ids,
      "Archive IDs changed: " + entry.archive,
    );
  }
  for (const source of variants(entry.source)) {
    const sourceFile = source.endsWith("/index.html")
      ? path.join(site, source.slice(1))
      : source.endsWith("/")
        ? path.join(site, source.slice(1), "index.html")
        : htmlFile(site, source);
    const html = await readFile(sourceFile, "utf8");
    routeVariants++;
    const canonicalFile =
      entry.canonical &&
      (source === entry.source || source === entry.source + ".html");
    const script = canonicalFile
      ? null
      : html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    if (canonicalFile) {
      assert(contentIds(html).length > 0);
      assert(html.includes("/docs-compat.js"));
    } else {
      assert(script, "Missing redirect script: " + source);
      assert.match(html, /<noscript><meta http-equiv="refresh"/);
      assert.match(html, /name="robots" content="noindex, follow"/);
      assert(
        html.includes(
          'href="https://caprover.com' + entry.target.split("#")[0] + '"',
        ),
      );
    }
    async function check(hash) {
      const href =
        "https://caprover.com" +
        source +
        "?utm_source=old-docs" +
        (hash ? "#" + encodeURIComponent(hash) : "");
      const expected = resolveRedirect(entry, href);
      if (script) {
        let destination;
        vm.runInNewContext(script, {
          URL,
          window: {
            location: {
              href,
              replace(target) {
                destination = target;
              },
            },
          },
        });
        assert.equal(
          destination,
          expected,
          "Generated resolver disagrees: " + href,
        );
      }
      assert.equal(
        new URL(expected, "https://caprover.com").search,
        "?utm_source=old-docs",
      );
      await validateTarget(expected, entry.locale);
    }
    await check("");
    for (const [anchor, mapping] of Object.entries(entry.fragments)) {
      await check(anchor);
      fragmentVariants++;
      if (mapping.policy === "archive") archiveFallbacks++;
      else currentAnchors++;
    }
  }
  for (const { policy } of Object.values(entry.fragments))
    policyCounts[policy] = (policyCounts[policy] ?? 0) + 1;
}
for (const route of canonical) {
  const html = await document(route);
  assert(!html.includes("<title>Redirecting"));
  contentIds(html); // Duplicate alias detection, including pages without historical routes.
}
const sitemap = await readFile(path.join(site, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
assert.equal(new Set(locations).size, locations.length);
assert(!/\/docs-(?:next|legacy)(?:\/|<)/.test(sitemap));
for (const route of canonical)
  assert(locations.includes("https://caprover.com" + route));
for (const entry of manifest.routes.filter((e) => !e.canonical))
  assert(!locations.includes("https://caprover.com" + entry.source));
// Every captured official reference must have a known route and a verified fragment.
const official = await readJson("docs-compat/official-links.json");
for (const ref of official.references) {
  const url = new URL(ref.url, "https://caprover.com");
  const entry = manifest.routes.find(
    (e) => e.source === normalizeRoute(url.pathname),
  );
  if (entry) {
    let anchor = decodeURIComponent(url.hash.slice(1));
    assert(
      !anchor ||
        Object.hasOwn(entry.fragments, anchor) ||
        entry.currentIds.includes(anchor),
      "Uninventoried official fragment: " + ref.url,
    );
    await validateTarget(resolveRedirect(entry, url.href), entry.locale);
  } else {
    assert(
      canonical.has(normalizeRoute(url.pathname)),
      "Uninventoried official route: " + ref.url,
    );
    const locale =
      locales.find(
        (l) => l.pathPrefix && url.pathname.startsWith(l.pathPrefix + "/"),
      )?.code ?? "en";
    await validateTarget(normalizeRoute(url.pathname) + url.hash, locale);
  }
}
const historicalPolicies = {};
for (const entry of manifest.routes.filter((e) => e.kind !== "alias")) {
  for (const id of history.pages[entry.evidence].ids) {
    const policy = entry.fragments[id].policy;
    historicalPolicies[policy] = (historicalPolicies[policy] ?? 0) + 1;
  }
}
const summary = {
  historicalPolicies,
  historicalDocuments: Object.keys(history.pages).length,
  historicalAnchors: Object.values(history.pages).reduce(
    (n, p) => n + p.ids.length,
    0,
  ),
  legacyRoutes: 36,
  previewRoutes: 142,
  locales: locales.length,
  normalizedSources: manifest.routes.length,
  routeVariants,
  fragmentVariants,
  policyCounts,
  archiveFallbacks,
  currentAnchors,
  officialReferences: official.references.length,
  canonicalPages: canonical.size,
  cycles: 0,
  collisions: 0,
  unresolvedKnownLinks: 0,
};
await writeJson(path.join(site, "docs-compat-audit.json"), summary);
if (process.argv.includes("--write-summary"))
  await writeJson("docs-compat/audit-summary.json", summary);
console.log(JSON.stringify(summary, null, 2));
