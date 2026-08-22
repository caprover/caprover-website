import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  access,
  appendFile,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { renderLocalePreferenceScript } from "./locale-preference.mjs";

const root = process.cwd();
const docsSite = path.join(root, "docs-site/build");
const marketingSite = path.join(root, "marketing-site/out");
const combinedSite = path.join(root, "build/combined-site");
const cnameSource = path.join(root, "docs-site/static/CNAME");
const locales = JSON.parse(
  await readFile(path.join(root, "content/locales.json"), "utf8"),
).filter((locale) => locale.enabled);
const defaultLocale = locales.find((locale) => locale.default);
const marketingRoutes = Object.values(
  JSON.parse(await readFile(path.join(root, "marketing-site/routes.json"), "utf8")),
).map((route) => route.path.replace(/^\//, "").replace(/\/$/, ""));

assert(defaultLocale, "An enabled default locale is required");

function localeOutputRoot(locale) {
  return locale.pathPrefix.replace(/^\//, "");
}

function marketingRouteFile(locale, route) {
  return path.join(marketingSite, localeOutputRoot(locale), route, "index.html");
}

function docsOutputRoot(locale) {
  return locale.default
    ? path.join(docsSite, "docs")
    : path.join(docsSite, localeOutputRoot(locale), "docs");
}

function combinedMarketingRouteFile(locale, route) {
  return path.join(combinedSite, localeOutputRoot(locale), route, "index.html");
}

async function injectLocalePreferenceScript(file) {
  const contents = await readFile(file, "utf8");
  assert.match(contents, /<\/head>/i, `HTML head is missing: ${path.relative(root, file)}`);
  await writeFile(
    file,
    contents.replace(
      /<\/head>/i,
      '    <script src="/locale-preference.js"></script>\n  </head>',
    ),
  );
}

async function requirePath(target) {
  try {
    await access(target);
  } catch {
    throw new Error(`Required build output is missing: ${path.relative(root, target)}`);
  }
}

async function requireNoCollision(name) {
  const target = path.join(docsSite, name);
  try {
    await access(target);
  } catch {
    return;
  }

  throw new Error(`Documentation output already owns reserved marketing path: ${name}`);
}

async function snapshot(directory) {
  const result = new Map();

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
        continue;
      }

      const relative = path.relative(directory, absolute);
      const contents = await readFile(absolute);
      result.set(relative, createHash("sha256").update(contents).digest("hex"));
    }
  }

  await walk(directory);
  return result;
}

async function assertSnapshotPreserved(expected, destination, description) {
  for (const [relative, hash] of expected) {
    const contents = await readFile(path.join(destination, relative));
    assert.equal(
      createHash("sha256").update(contents).digest("hex"),
      hash,
      `${description} changed: ${relative}`,
    );
  }
}

async function writeRedirect(file, destination, language) {
  await mkdir(path.dirname(file), { recursive: true });
  const encodedDestination = JSON.stringify(destination);
  await writeFile(
    file,
    `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${destination}">
    <link rel="canonical" href="https://caprover.com${destination}">
    <meta name="robots" content="noindex, follow">
    <title>Redirecting…</title>
  </head>
  <body>
    <p><a href="${destination}">Continue to the documentation</a></p>
    <script>window.location.replace(${encodedDestination} + window.location.search + window.location.hash);</script>
  </body>
</html>
`,
  );
}

await Promise.all([
  requirePath(path.join(docsSite, "docs/get-started.html")),
  ...locales.map((locale) =>
    requirePath(path.join(docsOutputRoot(locale), "get-started.html")),
  ),
  requirePath(path.join(docsSite, "img/logo.png")),
  requirePath(path.join(docsSite, "CNAME")),
  requirePath(cnameSource),
  ...locales.flatMap((locale) =>
    marketingRoutes.map((route) => requirePath(marketingRouteFile(locale, route))),
  ),
  requirePath(path.join(marketingSite, defaultLocale.code, "index.html")),
  requirePath(path.join(marketingSite, "_next")),
  requirePath(path.join(marketingSite, "homepage-assets")),
  requirePath(path.join(marketingSite, "sitemap.xml")),
  requireNoCollision("_next"),
  requireNoCollision("homepage-assets"),
  requireNoCollision("compare"),
]);

const originalCname = await readFile(cnameSource);
assert.equal(originalCname.toString().trim(), "caprover.com");

const [docsBefore, imagesBefore] = await Promise.all([
  Promise.all(
    locales.map(async (locale) => ({
      locale,
      files: await snapshot(docsOutputRoot(locale)),
    })),
  ),
  snapshot(path.join(docsSite, "img")),
]);

await rm(combinedSite, { recursive: true, force: true });
await mkdir(path.dirname(combinedSite), { recursive: true });
await cp(docsSite, combinedSite, { recursive: true });

await cp(path.join(marketingSite, "index.html"), path.join(combinedSite, "index.html"));
await cp(path.join(marketingSite, "_next"), path.join(combinedSite, "_next"), {
  recursive: true,
});
await cp(
  path.join(marketingSite, "homepage-assets"),
  path.join(combinedSite, "homepage-assets"),
  { recursive: true },
);
await cp(path.join(marketingSite, "compare"), path.join(combinedSite, "compare"), {
  recursive: true,
});
await rm(path.join(combinedSite, defaultLocale.code), {
  recursive: true,
  force: true,
});
await cp(
  path.join(marketingSite, defaultLocale.code),
  path.join(combinedSite, defaultLocale.code),
  {
    recursive: true,
  },
);
for (const locale of locales.filter((entry) => !entry.default)) {
  const outputRoot = localeOutputRoot(locale);
  await cp(path.join(marketingSite, outputRoot), path.join(combinedSite, outputRoot), {
    recursive: true,
  });
}

for (const { locale, files } of docsBefore) {
  for (const relative of files.keys()) {
    if (!relative.endsWith(".html")) continue;
    const documentPath = relative.slice(0, -".html".length);
    const canonical = `${locale.pathPrefix}/docs/${documentPath}`;
    await writeRedirect(
      path.join(combinedSite, "docs", locale.code, relative),
      canonical,
      locale.code,
    );
  }
}

const [docsSitemaps, marketingSitemap] = await Promise.all([
  Promise.all(
    locales.map((locale) =>
      readFile(
        path.join(
          combinedSite,
          locale.default ? "" : localeOutputRoot(locale),
          "sitemap.xml",
        ),
        "utf8",
      ),
    ),
  ),
  readFile(path.join(marketingSite, "sitemap.xml"), "utf8"),
]);
const marketingUrls = (marketingSitemap.match(/<url>[\s\S]*?<\/url>/g) ?? []).filter(
  (entry) => !entry.includes("<loc>https://caprover.com/</loc>"),
);
assert.equal(
  marketingUrls.length,
  locales.length * marketingRoutes.length - 1,
  "Marketing sitemap is missing localized URLs",
);
const docsUrls = docsSitemaps.flatMap(
  (sitemap) => sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [],
);
const allUrls = [...new Set([...docsUrls, ...marketingUrls])];
await writeFile(
  path.join(combinedSite, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.join("\n")}\n</urlset>\n`,
);
await writeFile(path.join(combinedSite, ".nojekyll"), "");
await requirePath(path.join(combinedSite, ".nojekyll"));

const [imagesAfter, combinedCname, marketingHtml, docsHtmlByLocale] = await Promise.all([
  snapshot(path.join(combinedSite, "img")),
  readFile(path.join(combinedSite, "CNAME")),
  readFile(path.join(combinedSite, "index.html"), "utf8"),
  Promise.all(
    locales.map((locale) =>
      readFile(
        path.join(
          combinedSite,
          locale.default ? "" : localeOutputRoot(locale),
          "docs/get-started.html",
        ),
        "utf8",
      ),
    ),
  ),
]);

await Promise.all(
  docsBefore.map(({ locale, files }) =>
    assertSnapshotPreserved(
      files,
      locale.default
        ? path.join(combinedSite, "docs")
        : path.join(combinedSite, localeOutputRoot(locale), "docs"),
      `${locale.code} documentation output`,
    ),
  ),
);
assert.deepEqual(imagesAfter, imagesBefore, "Legacy image output changed during composition");
assert.deepEqual(combinedCname, originalCname, "CNAME changed during composition");
const defaultMarketing = JSON.parse(
  await readFile(
    path.join(root, "content", defaultLocale.code, "marketing.json"),
    "utf8",
  ),
);
assert(
  marketingHtml.includes(defaultMarketing["homepage.hero.titleLine1"]),
  "Default marketing-site content is missing",
);
assert.match(marketingHtml, /(?:href|src)=["']\/_next\//);
assert.match(marketingHtml, /(?:href|src)=["']\/homepage-assets\//);

const marketingStylesheet = marketingHtml.match(
  /href=["\'](\/_next\/static\/css\/[^"\']+\.css)["\']/,
)?.[1];
assert(marketingStylesheet, "Marketing-site stylesheet reference is missing");

const marketingCss = await readFile(
  path.join(combinedSite, marketingStylesheet.slice(1)),
  "utf8",
);
const geistFontFaces = marketingCss
  .match(/@font-face\s*\{[^}]+\}/g)
  ?.filter((rule) => /font-family\s*:\s*"?Geist/.test(rule));
assert(
  geistFontFaces && geistFontFaces.length >= 2,
  "Marketing-site stylesheet does not contain the expected Geist font faces",
);

const docsStylesheets = new Set(
  docsHtmlByLocale.map((docsHtml) => {
    const match = docsHtml.match(
      /href=(?:["'](\/[^"']*assets\/css\/styles\.[^"']+\.css)["']|(\/[^\s>]*assets\/css\/styles\.[^\s>]+\.css))/,
    );
    const stylesheet = match?.[1] ?? match?.[2];
    assert(stylesheet, "Documentation stylesheet reference is missing");
    return stylesheet;
  }),
);

await Promise.all(
  [...docsStylesheets].map((stylesheet) =>
    appendFile(
      path.join(combinedSite, stylesheet.slice(1)),
      `\n/* Shared with the marketing site */\n${geistFontFaces.join("\n")}\n`,
    ),
  ),
);

const localizedHtmlFiles = new Set([
  ...docsBefore.flatMap(({ locale, files }) =>
    [...files.keys()]
      .filter((relative) => relative.endsWith(".html"))
      .map((relative) =>
        path.join(
          combinedSite,
          locale.default ? "docs" : localeOutputRoot(locale),
          locale.default ? relative : path.join("docs", relative),
        ),
      ),
  ),
  ...locales.flatMap((locale) =>
    marketingRoutes.map((route) => combinedMarketingRouteFile(locale, route)),
  ),
]);

await Promise.all([
  writeFile(
    path.join(combinedSite, "locale-preference.js"),
    renderLocalePreferenceScript(locales, defaultLocale),
  ),
  ...[...localizedHtmlFiles].map(injectLocalePreferenceScript),
]);

const combinedStats = await stat(combinedSite);
assert(combinedStats.isDirectory());

console.log("Combined site created at build/combined-site");
console.log(
  `Preserved ${docsBefore.reduce((total, entry) => total + entry.files.size, 0)} documentation files and ${imagesAfter.size} image files`,
);
