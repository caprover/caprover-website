import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Script } from "node:vm";
import {
  contentIds,
  documentMetadata,
  htmlFile,
  normalizeRoute,
  readCanonicalDocs,
  readJson,
  resolveRedirect,
  variants,
  writeJson,
} from "./docs-redirects.mjs";

const site = path.resolve("build/combined-site");
const origin = "https://caprover.com";
const locales = (await readJson("content/locales.json")).filter(
  ({ enabled }) => enabled,
);
const canonical = await readCanonicalDocs(
  path.resolve("docs-site/build"),
  locales,
);
const { routes } = await readJson(
  path.join(site, "docs-redirect-manifest.json"),
);
const inventory = await readJson("docs-compat/historical-routes.json");
const history = await readJson("docs-compat/historical-anchors.json");
const official = await readJson("docs-compat/official-links.json");
const activeLocales = new Set(locales.map(({ code }) => code));
assert.deepEqual(
  routes.map(({ source, kind, locale, evidence, canonical }) => ({
    source,
    kind,
    locale,
    evidence,
    canonical,
  })),
  inventory.routes.filter(({ locale }) => activeLocales.has(locale)),
  "Missing or changed historical routes in the combined site",
);

const sitemap = await readFile(path.join(site, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.equal(
  new Set(locations).size,
  locations.length,
  "Duplicate sitemap URL",
);
assert.doesNotMatch(sitemap, /\/docs-(?:next|legacy)(?:\/|<)/);
const pages = new Map();
for (const [route, locale] of canonical) {
  const html = await readFile(htmlFile(site, route), "utf8");
  const metadata = documentMetadata(html);
  assert.deepEqual(
    metadata.canonical,
    [origin + route],
    "Incorrect canonical: " + route,
  );
  assert.equal(metadata.language, locale, "Incorrect language: " + route);
  assert.doesNotMatch(metadata.robots ?? "", /noindex/);
  const prefix = locales.find(({ code }) => code === locale).pathPrefix;
  for (const alternate of locales) {
    assert(
      metadata.alternates.includes(
        origin + alternate.pathPrefix + route.slice(prefix.length),
      ),
      "Missing localized alternate: " + route + " → " + alternate.code,
    );
  }
  assert(locations.includes(origin + route), "Missing sitemap URL: " + route);
  pages.set(route, contentIds(html));
}

function validateTarget(destination, locale) {
  const url = new URL(destination, origin);
  assert.equal(url.origin, origin);
  assert.equal(
    canonical.get(url.pathname),
    locale,
    "Non-canonical destination or wrong locale: " + destination,
  );
  if (url.hash) {
    assert(
      pages.get(url.pathname).includes(decodeURIComponent(url.hash.slice(1))),
      "Missing final fragment: " + destination,
    );
  }
}

function runRedirect(script, url) {
  let destination = url.pathname + url.search + url.hash;
  const location = {
    href: url.href,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    replace(target) {
      destination = target;
    },
  };
  script.runInNewContext({
    URL,
    location,
    localStorage: { setItem() {} },
    history: {
      replaceState(_state, _title, target) {
        destination = target;
      },
    },
    window: { location, scrollTo() {}, addEventListener() {} },
  });
  return destination;
}

const canonicalScript = new Script(
  await readFile(path.join(site, "docs-compat.js"), "utf8"),
);
const policyCounts = {};
let routeVariants = 0;
let fragmentVariants = 0;
for (const entry of routes) {
  for (const anchor of history.pages[entry.evidence].ids) {
    assert(
      Object.hasOwn(entry.fragments, anchor),
      "Missing historical heading: " + entry.source + "#" + anchor,
    );
  }
  if (!entry.canonical) assert(!locations.includes(origin + entry.source));

  for (const source of variants(entry.source)) {
    const file = source.endsWith("/") ? source + "index.html" : source;
    const html = await readFile(
      file.endsWith(".html") ? path.join(site, file) : htmlFile(site, file),
      "utf8",
    );
    const servesArticle =
      entry.canonical &&
      (source === entry.source || source === entry.source + ".html");
    let script = canonicalScript;
    if (servesArticle) {
      assert(
        html.includes("/docs-compat.js"),
        "Missing compatibility script: " + source,
      );
    } else {
      const inline = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
      assert(inline, "Missing redirect script: " + source);
      script = new Script(inline);
      assert.match(html, /<noscript><meta http-equiv="refresh"/);
      const { canonical: redirectsTo, robots } = documentMetadata(html);
      assert.deepEqual(redirectsTo, [origin + entry.target.split("#")[0]]);
      assert.equal(robots, "noindex, follow");
    }
    routeVariants++;

    for (const anchor of ["", ...Object.keys(entry.fragments)]) {
      const url = new URL(
        source + "?utm_source=old-docs&tag=one&tag=two",
        origin,
      );
      url.hash = anchor ? encodeURIComponent(anchor) : "";
      const destination = runRedirect(script, url);
      assert.equal(
        destination,
        resolveRedirect(entry, url.href),
        "Unexpected redirect: " + url.href,
      );
      assert.equal(new URL(destination, origin).search, url.search);
      validateTarget(destination, entry.locale);
      if (anchor) fragmentVariants++;
    }
  }
  for (const { policy } of Object.values(entry.fragments)) {
    policyCounts[policy] = (policyCounts[policy] ?? 0) + 1;
  }
}

const lookup = new Map(routes.map((entry) => [entry.source, entry]));
for (const { url: reference } of official.references) {
  const url = new URL(reference, origin);
  const source = normalizeRoute(url.pathname);
  const entry = lookup.get(source);
  const destination = entry
    ? resolveRedirect(entry, url.href)
    : source + url.hash;
  validateTarget(destination, entry?.locale ?? canonical.get(source));
  assert(
    canonical.has(new URL(destination, origin).pathname),
    "Uninventoried reference: " + reference,
  );
}

const summary = {
  canonicalPages: canonical.size,
  historicalPaths: routes.length,
  routeVariants,
  fragmentVariants,
  policyCounts,
  officialReferences: official.references.length,
};
await writeJson(path.join(site, "docs-compat-audit.json"), summary);
console.log(JSON.stringify(summary, null, 2));
