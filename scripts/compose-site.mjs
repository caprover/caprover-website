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

const root = process.cwd();
const docsSite = path.join(root, "docs-site/build/CapRover");
const marketingSite = path.join(root, "marketing-site/out");
const combinedSite = path.join(root, "build/combined-site");
const locales = JSON.parse(
  await readFile(path.join(root, "content/locales.json"), "utf8"),
).filter((locale) => locale.enabled);
const defaultLocale = locales.find((locale) => locale.default);
const marketingRoutes = [
  "",
  "compare",
  "compare/coolify",
  "compare/dokploy",
  "compare/dokku",
];

assert(defaultLocale, "An enabled default locale is required");

function localeOutputRoot(locale) {
  return locale.pathPrefix.replace(/^\//, "");
}

function marketingRouteFile(locale, route) {
  return path.join(marketingSite, localeOutputRoot(locale), route, "index.html");
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

await Promise.all([
  requirePath(path.join(docsSite, "docs/get-started.html")),
  ...locales.map((locale) =>
    requirePath(path.join(docsSite, "docs", locale.code, "get-started.html")),
  ),
  requirePath(path.join(docsSite, "img/logo.png")),
  requirePath(path.join(docsSite, "CNAME")),
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

const originalCname = await readFile(path.join(docsSite, "CNAME"));
assert.equal(originalCname.toString().trim(), "caprover.com");

const [docsBefore, imagesBefore] = await Promise.all([
  snapshot(path.join(docsSite, "docs")),
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
  await rm(path.join(combinedSite, outputRoot), { recursive: true, force: true });
  await cp(path.join(marketingSite, outputRoot), path.join(combinedSite, outputRoot), {
    recursive: true,
  });
}
const [legacySitemap, marketingSitemap] = await Promise.all([
  readFile(path.join(combinedSite, "sitemap.xml"), "utf8"),
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
assert.match(legacySitemap, /<\/urlset>\s*$/);
await writeFile(
  path.join(combinedSite, "sitemap.xml"),
  legacySitemap.replace(/<\/urlset>\s*$/, `${marketingUrls.join("\n")}\n</urlset>\n`),
);
await writeFile(path.join(combinedSite, ".nojekyll"), "");
await requirePath(path.join(combinedSite, ".nojekyll"));

const [docsAfter, imagesAfter, combinedCname, marketingHtml] = await Promise.all([
  snapshot(path.join(combinedSite, "docs")),
  snapshot(path.join(combinedSite, "img")),
  readFile(path.join(combinedSite, "CNAME")),
  readFile(path.join(combinedSite, "index.html"), "utf8"),
]);

assert.deepEqual(docsAfter, docsBefore, "Documentation output changed during composition");
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

await appendFile(
  path.join(combinedSite, "css/main.css"),
  `\n/* Shared with the marketing site */\n${geistFontFaces.join("\n")}\n`,
);

const combinedStats = await stat(combinedSite);
assert(combinedStats.isDirectory());

console.log("Combined site created at build/combined-site");
console.log(`Preserved ${docsAfter.size} documentation files and ${imagesAfter.size} legacy image files`);
