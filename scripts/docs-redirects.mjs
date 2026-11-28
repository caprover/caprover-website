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
    alternates: $('link[rel="alternate"][hreflang]')
      .map((_, el) => $(el).attr("href"))
      .get(),
  };
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
const outputFiles = (route) => [
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

export async function readCanonicalDocs(site, locales) {
  const pages = new Map();
  for (const { code, pathPrefix } of locales) {
    const sitemap = await readFile(
      path.join(site, pathPrefix, "sitemap.xml"),
      "utf8",
    );
    for (const [, pathname] of sitemap.matchAll(
      /<loc>https:\/\/caprover\.com([^<]+)<\/loc>/g,
    )) {
      if (!pathname.startsWith(pathPrefix + "/docs/")) continue;
      assert(!pages.has(pathname), "Duplicate canonical page: " + pathname);
      pages.set(pathname, code);
    }
    assert.equal(pages.get(pathPrefix + "/docs/get-started"), code);
  }
  return pages;
}

export async function buildManifest(root, site) {
  const [inventory, targets, history, overrides, config] = await Promise.all(
    [
      "docs-compat/historical-routes.json",
      "docs-compat/route-targets.json",
      "docs-compat/historical-anchors.json",
      "docs-compat/anchor-overrides.json",
      "content/locales.json",
    ].map((file) => readJson(path.join(root, file))),
  );
  const locales = config.filter(({ enabled }) => enabled);
  const prefixes = new Map(
    locales.map(({ code, pathPrefix }) => [code, pathPrefix]),
  );
  const canonical = await readCanonicalDocs(site, locales);
  const seen = new Set();
  const evidence = new Set();
  const targetKeys = new Set();
  const cache = new Map();

  async function validate(target, locale) {
    localTarget(target);
    const url = new URL(target, "https://caprover.com");
    assert.equal(
      canonical.get(url.pathname),
      locale,
      "Redirect cycle, non-canonical destination, or wrong locale: " + target,
    );
    if (!cache.has(url.pathname)) {
      cache.set(
        url.pathname,
        contentIds(await readFile(htmlFile(site, url.pathname), "utf8")),
      );
    }
    const ids = cache.get(url.pathname);
    if (url.hash) {
      assert(
        ids.includes(decodeURIComponent(url.hash.slice(1))),
        "Missing target anchor: " + target,
      );
    }
    return ids;
  }

  const routes = [];
  for (const route of inventory.routes) {
    if (!prefixes.has(route.locale)) continue;
    const prefix = prefixes.get(route.locale);
    assert.equal(normalizeRoute(route.source), route.source);
    assert(!seen.has(route.source), "Duplicate source: " + route.source);
    seen.add(route.source);
    assert.equal(
      canonical.has(route.source),
      route.canonical,
      "Canonical collision: " + route.source,
    );
    const historical = history.pages[route.evidence];
    assert(historical, "Missing historical evidence: " + route.source);
    evidence.add(route.evidence);

    assert(
      route.evidence.startsWith(prefix + "/docs"),
      "Wrong evidence locale: " + route.source,
    );
    const targetKey = route.evidence.slice(prefix.length);
    assert(
      Object.hasOwn(targets, targetKey),
      "Missing destination: " + route.source,
    );
    targetKeys.add(targetKey);
    const target = prefix + localTarget(targets[targetKey]);
    const targetPath = target.split("#")[0];
    if (route.canonical) {
      assert.equal(
        target,
        route.source,
        "Canonical page must retain its URL: " + route.source,
      );
    }
    const currentIds = await validate(target, route.locale);
    const explicit = overrides.routes[route.evidence] ?? {};
    const fallback = overrides.previewFallbacks[route.evidence] ?? target;
    const fragments = Object.fromEntries(
      [...new Set([...historical.ids, ...Object.keys(explicit)])]
        .sort()
        .map((anchor) => {
          if (
            currentIds.includes(anchor) &&
            (route.canonical || !Object.hasOwn(explicit, anchor))
          ) {
            return [
              anchor,
              {
                target: targetPath + "#" + encodeURIComponent(anchor),
                policy: "current",
              },
            ];
          }
          if (Object.hasOwn(explicit, anchor)) {
            const destination = explicit[anchor];
            return [
              anchor,
              {
                target: destination,
                policy: destination.includes("#")
                  ? "equivalent"
                  : "page-fallback",
              },
            ];
          }
          return [
            anchor,
            {
              target: fallback,
              policy: fallback.includes("#")
                ? "section-fallback"
                : "page-fallback",
            },
          ];
        }),
    );
    for (const mapping of Object.values(fragments))
      await validate(mapping.target, route.locale);
    routes.push({ ...route, target, fragments });
  }

  // A historical source can back several URL formats, including old locale aliases.
  // Keep the evidence and destinations covered when the route inventory changes.
  for (const source of Object.keys(history.pages)) {
    const locale = locales.find(
      ({ pathPrefix }) => pathPrefix && source.startsWith(pathPrefix + "/"),
    );
    if (!locale && !source.startsWith("/docs")) continue;
    assert(evidence.has(source), "Uncovered historical evidence: " + source);
  }
  for (const key of Object.keys(targets))
    assert(targetKeys.has(key), "Unused destination: " + key);
  assert.equal(inventory.previewRevision, history.previewRevision);
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
<script>${/^\/docs\/en(?:\/|$)/.test(entry.source) ? 'try { localStorage.setItem("caprover.locale", "en"); } catch {}' : ""}window.location.replace((${resolveRedirect.toString()})(${scriptJson({ target: entry.target, fragments: entry.fragments })}, window.location.href));</script>
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
      await mkdir(path.dirname(file), { recursive: true });
      // Never overwrite a Docusaurus-owned file.
      try {
        await writeFile(file, renderRedirect(entry), { flag: "wx" });
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
        throw new Error("Output already exists: " + relative, { cause: error });
      }
    }
  }
  const active = Object.fromEntries(
    manifest.routes
      .filter((entry) => entry.canonical)
      .map(({ source, target, fragments }) => [
        source,
        {
          target,
          fragments: Object.fromEntries(
            Object.entries(fragments).filter(
              ([, mapping]) => mapping.policy !== "current",
            ),
          ),
        },
      ]),
  );
  await writeFile(
    path.join(site, "docs-compat.js"),
    `(() => {
const entries = ${scriptJson(active)};
const resolve = ${resolveRedirect.toString()};
function navigate() {
  const pathname = location.pathname.replace(/\\.html$/, '').replace(/\\/$/, '');
  const entry = entries[pathname];
  if (!entry) return;
  const current = location.pathname + location.search + location.hash;
  const destination = resolve(entry, location.href);
  if (destination === current) return;
  if (destination === location.pathname + location.search) {
    history.replaceState(history.state, "", destination);
    window.scrollTo(0, 0);
  } else {
    location.replace(destination);
  }
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
