import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const { load } = createRequire(
  new URL("../docs-site/package.json", import.meta.url),
)("cheerio");

export const readJson = async (file) =>
  JSON.parse(await readFile(file, "utf8"));
export const writeJson = async (file, value) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2) + "\n");
};
export function contentIds(html) {
  const $ = load(html);
  assert.equal($("article").length, 1, "Expected one documentation article");
  const ids = $("article [id]")
    .map((_, element) => $(element).attr("id"))
    .get();
  assert.equal(new Set(ids).size, ids.length, "Duplicate article IDs");
  return ids.sort();
}
export function documentMetadata(html) {
  const $ = load(html);
  return {
    language: $("html").attr("lang"),
    canonical: $('link[rel="canonical"]')
      .map((_, el) => $(el).attr("href"))
      .get(),
    robots: $('meta[name="robots"]').attr("content"),
  };
}
export function validateFinalTargets(routes, finalPaths) {
  for (const entry of routes) {
    for (const target of [
      entry.target,
      ...Object.values(entry.fragments).map((m) => m.target),
    ]) {
      localTarget(target);
      assert(
        finalPaths.has(new URL(target, "https://caprover.com").pathname),
        "Redirect cycle or non-final destination: " + target,
      );
    }
  }
}
export function normalizeRoute(route) {
  assert(
    typeof route === "string" &&
      route.startsWith("/") &&
      !route.startsWith("//") &&
      !/[\\?#\s]/.test(route),
    "Expected local pathname: " + route,
  );
  const url = new URL(route, "https://caprover.com");
  assert.equal(url.pathname, route, "Non-normalized pathname: " + route);
  return (
    route
      .replace(/\/index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "") || "/"
  );
}
export function localTarget(target) {
  assert(
    typeof target === "string" &&
      target.startsWith("/") &&
      !target.startsWith("//") &&
      !target.includes("\\"),
    "Expected local destination",
  );
  const url = new URL(target, "https://caprover.com");
  assert.equal(url.origin, "https://caprover.com");
  assert(!url.search, "Destination must not contain a query");
  assert.equal(
    url.pathname,
    target.split("#")[0],
    "Non-normalized destination",
  );
  assert.equal(
    normalizeRoute(url.pathname),
    url.pathname,
    "Canonical destination required",
  );
  return target;
}
export const variants = (route) => [
  route,
  route + "/",
  route + ".html",
  route + "/index.html",
];
export const outputFiles = (route) => [
  route.slice(1) + ".html",
  route.slice(1) + "/index.html",
];
export const htmlFile = (root, route) =>
  path.join(root, normalizeRoute(route).slice(1) + ".html");

// This function is also serialized verbatim into the browser bundle. Keep it pure.
export function resolveRedirect(entry, href) {
  const incoming = new URL(href, "https://caprover.com");
  let fragment = incoming.hash.slice(1);
  try {
    fragment = decodeURIComponent(fragment);
  } catch {
    /* Preserve malformed unknown hashes. */
  }
  const mapped =
    fragment && Object.hasOwn(entry.fragments, fragment)
      ? entry.fragments[fragment]
      : null;
  const target = new URL(mapped?.target ?? entry.target, incoming.origin);
  if (target.origin !== incoming.origin)
    throw new Error("External redirect destination");
  target.search = incoming.search;
  if (fragment && !mapped) target.hash = incoming.hash;
  return target.pathname + target.search + target.hash;
}

export function routeCatalog(catalog, locales) {
  const canonical = new Set(
    catalog.sections.flatMap((s) =>
      s.pages.map((p) => "/docs/" + p.target.replace(/\/index$/, "")),
    ),
  );
  const routes = [];
  for (const locale of locales) {
    const prefix = locale.pathPrefix;
    for (const old of catalog.legacyEnglishRoutes) {
      const source = prefix + old.legacy;
      const entry = {
        source,
        kind: "legacy",
        locale: locale.code,
        evidence: source,
        target: prefix + old.newCanonical,
        archive: prefix + old.legacy.replace("/docs/", "/docs-legacy/"),
        canonical: canonical.has(old.legacy),
      };
      routes.push(entry, {
        ...entry,
        source: "/docs/" + locale.code + old.legacy.slice("/docs".length),
        kind: "alias",
        canonical: false,
      });
    }
    for (const old of [
      ...catalog.previewRoutes,
      ...catalog.addedAfterOriginalConsolidation.map((id) => ({
        from: "/docs-next/" + id,
        to: "/docs-next/" + id,
        decision: "keep",
      })),
    ]) {
      const relative = old.from.slice("/docs-next/".length).replace(/\/$/, "");
      const marker =
        old.decision === "merge" && relative !== "installation/play-with-docker"
          ? "#source-" + relative.replace(/[^a-z0-9]+/gi, "-")
          : "";
      routes.push({
        source: prefix + old.from,
        kind: "preview",
        locale: locale.code,
        evidence: prefix + old.from,
        target: prefix + old.to.replace("/docs-next/", "/docs/") + marker,
        canonical: false,
      });
    }
  }
  const seen = new Set();
  for (const route of routes) {
    route.source = normalizeRoute(route.source);
    route.evidence = route.evidence && normalizeRoute(route.evidence);
    assert(!seen.has(route.source), "Duplicate source: " + route.source);
    seen.add(route.source);
    localTarget(route.target);
  }
  return routes.sort((a, b) => a.source.localeCompare(b.source, "en"));
}

export async function buildManifest(root, site) {
  const catalog = await readJson(
    path.join(root, "DOCS_CONSOLIDATION_MAP.json"),
  );
  const locales = (
    await readJson(path.join(root, "content/locales.json"))
  ).filter((l) => l.enabled);
  const history = await readJson(
    path.join(root, "docs-compat/historical-anchors.json"),
  );
  const overrides = await readJson(
    path.join(root, "docs-compat/anchor-overrides.json"),
  );
  const routes = routeCatalog(catalog, locales);
  const cache = new Map();
  async function ids(route) {
    const pathname = new URL(route, "https://caprover.com").pathname;
    if (!cache.has(pathname))
      cache.set(
        pathname,
        contentIds(await readFile(htmlFile(site, pathname), "utf8")),
      );
    return cache.get(pathname);
  }
  async function validate(target) {
    localTarget(target);
    const url = new URL(target, "https://caprover.com");
    const anchors = await ids(target);
    if (url.hash)
      assert(
        anchors.includes(decodeURIComponent(url.hash.slice(1))),
        "Missing target anchor: " + target,
      );
  }
  for (const entry of routes) {
    await validate(entry.target);
    const current = await ids(entry.target);
    const historical = history.pages[entry.evidence]?.ids ?? [];
    if (entry.kind !== "root")
      assert(
        history.pages[entry.evidence] ||
          catalog.addedAfterOriginalConsolidation.some((id) =>
            entry.source.endsWith("/docs-next/" + id),
          ),
        "Missing historical evidence: " + entry.source,
      );
    entry.fragments = {};
    const explicit = overrides.routes[entry.evidence] ?? {};
    for (const anchor of [
      ...new Set([...historical, ...Object.keys(explicit)]),
    ].sort()) {
      let target, policy;
      if (explicit[anchor]) {
        ({ target, policy } = explicit[anchor]);
      } else if (current.includes(anchor)) {
        target = entry.target.split("#")[0] + "#" + anchor;
        policy = "current";
      } else if (entry.archive) {
        target = entry.archive + "#" + anchor;
        policy = "archive";
      } else {
        // All changed preview headings require a reviewed section fallback.
        const fallback = overrides.previewFallbacks[entry.evidence];
        target =
          fallback ?? (entry.target.includes("#source-") ? entry.target : null);
        assert(
          target,
          "Missing reviewed preview fallback: " + entry.evidence + "#" + anchor,
        );
        policy = "source-section";
      }
      await validate(target);
      assert.equal(
        new URL(target, "https://caprover.com").pathname.startsWith(
          "/" + entry.locale + "/",
        ),
        entry.locale !== "en",
        "Wrong target locale: " + target,
      );
      entry.fragments[anchor] = { target, policy };
    }
    entry.currentIds = current;
  }
  for (const [source, anchors] of Object.entries(overrides.routes)) {
    assert(
      routes.some((r) => r.evidence === source),
      "Unused override route: " + source,
    );
    for (const [anchor, mapping] of Object.entries(anchors))
      assert(
        mapping.reason,
        "Missing semantic rationale: " + source + "#" + anchor,
      );
  }
  const finalPaths = new Set(
    catalog.sections.flatMap((s) =>
      s.pages.flatMap((p) =>
        locales.map(
          (l) => l.pathPrefix + "/docs/" + p.target.replace(/\/index$/, ""),
        ),
      ),
    ),
  );
  for (const route of routes) if (route.archive) finalPaths.add(route.archive);
  validateFinalTargets(routes, finalPaths);
  return { version: 1, routes };
}

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const scriptJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
export function renderRedirect(entry) {
  const canonical = entry.target.split("#")[0];
  const target = escapeHtml(entry.target);
  return `<!doctype html><html lang="${escapeHtml(entry.locale)}"><head><meta charset="utf-8">
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
<link rel="canonical" href="https://caprover.com${escapeHtml(canonical)}">
<meta name="robots" content="noindex, follow"><title>Redirecting…</title></head><body>
<p><a href="${target}">Continue to the documentation</a></p>
<script>${entry.source.startsWith("/docs/en/") ? 'try { localStorage.setItem("caprover.locale", "en"); } catch {}' : ""}window.location.replace((${resolveRedirect.toString()})(${scriptJson({ target: entry.target, fragments: entry.fragments })}, window.location.href));</script>
</body></html>\n`;
}

export async function writeCompatibility(site, manifest) {
  const outputs = new Set();
  for (const entry of manifest.routes) {
    for (const relative of outputFiles(entry.source)) {
      assert(!outputs.has(relative), "Redirect output collision: " + relative);
      outputs.add(relative);
      if (
        entry.canonical &&
        relative.endsWith(".html") &&
        !relative.endsWith("/index.html")
      )
        continue;
      const file = path.join(site, relative);
      // Never overwrite a Docusaurus-owned file.
      try {
        await readFile(file);
        throw new Error("Output already exists: " + relative);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, renderRedirect(entry));
    }
  }
  const active = manifest.routes
    .filter((e) => e.canonical)
    .map((e) => ({
      source: e.source,
      target: e.target,
      fragments: Object.fromEntries(
        Object.entries(e.fragments).filter(
          ([id]) => !e.currentIds.includes(id),
        ),
      ),
    }));
  await writeFile(
    path.join(site, "docs-compat.js"),
    `(() => {
const entries = ${scriptJson(active)};
const resolve = ${resolveRedirect.toString()};
function navigate() {
  const pathname = location.pathname.replace(/\\.html$/, '').replace(/\\/$/, '');
  const entry = entries.find(e => e.source === pathname);
  if (!entry) return;
  if (location.pathname !== entry.source) {
    location.replace(resolve(entry, location.href));
    return;
  }
  if (!location.hash) return;
  let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (!Object.hasOwn(entry.fragments, id)) return;
  const target = resolve(entry, location.href);
  if (target !== location.pathname + location.search + location.hash) location.replace(target);
}
navigate();
window.addEventListener('hashchange', navigate);
window.addEventListener('popstate', navigate);
// Docusaurus emits this after client-side route navigation (see client module).
window.addEventListener('caprover:route-update', navigate);
})();\n`,
  );
  await writeJson(path.join(site, "docs-redirect-manifest.json"), manifest);
}
