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
const legacySite = path.join(root, "website/build/CapRover");
const homepage = path.join(root, "homepage/out");
const combinedSite = path.join(root, "build/combined-site");
const locales = JSON.parse(
  await readFile(path.join(root, "content/locales.json"), "utf8"),
).filter((locale) => locale.enabled);
const defaultLocale = locales.find((locale) => locale.default);
const homepageRoutes = [
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

function homepageRouteFile(locale, route) {
  return path.join(homepage, localeOutputRoot(locale), route, "index.html");
}

async function requirePath(target) {
  try {
    await access(target);
  } catch {
    throw new Error(`Required build output is missing: ${path.relative(root, target)}`);
  }
}

async function requireNoCollision(name) {
  const target = path.join(legacySite, name);
  try {
    await access(target);
  } catch {
    return;
  }

  throw new Error(`Legacy output already owns reserved homepage path: ${name}`);
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
  requirePath(path.join(legacySite, "docs/get-started.html")),
  ...locales.map((locale) =>
    requirePath(path.join(legacySite, "docs", locale.code, "get-started.html")),
  ),
  requirePath(path.join(legacySite, "img/logo.png")),
  requirePath(path.join(legacySite, "CNAME")),
  ...locales.flatMap((locale) =>
    homepageRoutes.map((route) => requirePath(homepageRouteFile(locale, route))),
  ),
  requirePath(path.join(homepage, defaultLocale.code, "index.html")),
  requirePath(path.join(homepage, "_next")),
  requirePath(path.join(homepage, "homepage-assets")),
  requirePath(path.join(homepage, "sitemap.xml")),
  requireNoCollision("_next"),
  requireNoCollision("homepage-assets"),
  requireNoCollision("compare"),
]);

const originalCname = await readFile(path.join(legacySite, "CNAME"));
assert.equal(originalCname.toString().trim(), "caprover.com");

const [docsBefore, imagesBefore] = await Promise.all([
  snapshot(path.join(legacySite, "docs")),
  snapshot(path.join(legacySite, "img")),
]);

await rm(combinedSite, { recursive: true, force: true });
await mkdir(path.dirname(combinedSite), { recursive: true });
await cp(legacySite, combinedSite, { recursive: true });

await cp(path.join(homepage, "index.html"), path.join(combinedSite, "index.html"));
await cp(path.join(homepage, "_next"), path.join(combinedSite, "_next"), {
  recursive: true,
});
await cp(
  path.join(homepage, "homepage-assets"),
  path.join(combinedSite, "homepage-assets"),
  { recursive: true },
);
await cp(path.join(homepage, "compare"), path.join(combinedSite, "compare"), {
  recursive: true,
});
await rm(path.join(combinedSite, defaultLocale.code), {
  recursive: true,
  force: true,
});
await cp(
  path.join(homepage, defaultLocale.code),
  path.join(combinedSite, defaultLocale.code),
  {
    recursive: true,
  },
);
for (const locale of locales.filter((entry) => !entry.default)) {
  const outputRoot = localeOutputRoot(locale);
  await rm(path.join(combinedSite, outputRoot), { recursive: true, force: true });
  await cp(path.join(homepage, outputRoot), path.join(combinedSite, outputRoot), {
    recursive: true,
  });
}
const [legacySitemap, homepageSitemap] = await Promise.all([
  readFile(path.join(combinedSite, "sitemap.xml"), "utf8"),
  readFile(path.join(homepage, "sitemap.xml"), "utf8"),
]);
const homepageUrls = (homepageSitemap.match(/<url>[\s\S]*?<\/url>/g) ?? []).filter(
  (entry) => !entry.includes("<loc>https://caprover.com/</loc>"),
);
assert.equal(
  homepageUrls.length,
  locales.length * homepageRoutes.length - 1,
  "Homepage sitemap is missing localized URLs",
);
assert.match(legacySitemap, /<\/urlset>\s*$/);
await writeFile(
  path.join(combinedSite, "sitemap.xml"),
  legacySitemap.replace(/<\/urlset>\s*$/, `${homepageUrls.join("\n")}\n</urlset>\n`),
);
await writeFile(path.join(combinedSite, ".nojekyll"), "");
await requirePath(path.join(combinedSite, ".nojekyll"));

const [docsAfter, imagesAfter, combinedCname, homepageHtml] = await Promise.all([
  snapshot(path.join(combinedSite, "docs")),
  snapshot(path.join(combinedSite, "img")),
  readFile(path.join(combinedSite, "CNAME")),
  readFile(path.join(combinedSite, "index.html"), "utf8"),
]);

assert.deepEqual(docsAfter, docsBefore, "Documentation output changed during composition");
assert.deepEqual(imagesAfter, imagesBefore, "Legacy image output changed during composition");
assert.deepEqual(combinedCname, originalCname, "CNAME changed during composition");
const defaultWebsite = JSON.parse(
  await readFile(
    path.join(root, "content", defaultLocale.code, "website.json"),
    "utf8",
  ),
);
assert(
  homepageHtml.includes(defaultWebsite["homepage.hero.titleLine1"]),
  "Default homepage content is missing",
);
assert.match(homepageHtml, /(?:href|src)=["']\/_next\//);
assert.match(homepageHtml, /(?:href|src)=["']\/homepage-assets\//);

const homepageStylesheet = homepageHtml.match(
  /href=["\'](\/_next\/static\/css\/[^"\']+\.css)["\']/,
)?.[1];
assert(homepageStylesheet, "Homepage stylesheet reference is missing");

const homepageCss = await readFile(
  path.join(combinedSite, homepageStylesheet.slice(1)),
  "utf8",
);
const geistFontFaces = homepageCss
  .match(/@font-face\s*\{[^}]+\}/g)
  ?.filter((rule) => /font-family\s*:\s*"?Geist/.test(rule));
assert(
  geistFontFaces && geistFontFaces.length >= 2,
  "Homepage stylesheet does not contain the expected Geist font faces",
);

await appendFile(
  path.join(combinedSite, "css/main.css"),
  `\n/* Shared with the redesigned homepage */\n${geistFontFaces.join("\n")}\n`,
);

const combinedStats = await stat(combinedSite);
assert(combinedStats.isDirectory());

console.log("Combined site created at build/combined-site");
console.log(`Preserved ${docsAfter.size} documentation files and ${imagesAfter.size} legacy image files`);
