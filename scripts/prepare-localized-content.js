const fs = require("fs");
const path = require("path");
const { toDocusaurusCatalogs } = require("./docs-ui-catalogs");

const root = path.resolve(__dirname, "..");
const contentRoot = path.join(root, "content");
const locales = require(path.join(contentRoot, "locales.json"));
const enabledLocales = locales.filter((locale) => locale.enabled);
const defaultLocales = enabledLocales.filter((locale) => locale.default);

if (defaultLocales.length !== 1) {
  throw new Error("Exactly one enabled default locale is required");
}

const defaultLocale = defaultLocales[0];
const localeCodes = new Set();
const pathPrefixes = new Set();

for (const locale of enabledLocales) {
  if (
    !locale.code ||
    !locale.label ||
    typeof locale.pathPrefix !== "string" ||
    localeCodes.has(locale.code)
  ) {
    throw new Error(`Invalid or duplicate locale: ${locale.code}`);
  }
  if (pathPrefixes.has(locale.pathPrefix)) {
    throw new Error(`Duplicate locale path prefix: ${locale.pathPrefix}`);
  }
  if (locale.default && locale.pathPrefix !== "") {
    throw new Error(`Default locale ${locale.code} must use an empty path prefix`);
  }
  if (
    !locale.default &&
    (!locale.pathPrefix.startsWith("/") || locale.pathPrefix.endsWith("/"))
  ) {
    throw new Error(
      `Locale ${locale.code} path prefix must start with / and omit the trailing /`,
    );
  }
  localeCodes.add(locale.code);
  pathPrefixes.add(locale.pathPrefix);
}

function relativeFiles(directory) {
  const files = [];

  function walk(current) {
    for (const entry of fs.readdirSync(current)) {
      const absolute = path.join(current, entry);
      if (fs.statSync(absolute).isDirectory()) {
        walk(absolute);
      } else {
        files.push(path.relative(directory, absolute));
      }
    }
  }

  walk(directory);
  return files.sort();
}

function assertSameList(actual, expected, description) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${description} does not match ${defaultLocale.code}`);
  }
}

function assertFlatStringCatalog(catalog, description) {
  const keys = Object.keys(catalog);
  const keySet = new Set(keys);
  const numericGroups = new Map();

  for (const key of keys) {
    if (typeof catalog[key] !== "string") {
      throw new Error(`${description} value ${key} must be a string`);
    }

    const segments = key.split(".");
    for (let index = 1; index < segments.length; index += 1) {
      const prefix = segments.slice(0, index).join(".");
      if (keySet.has(prefix)) {
        throw new Error(`${description} key ${prefix} conflicts with nested key ${key}`);
      }
    }

    segments.forEach((segment, index) => {
      if (!/^\d+$/.test(segment)) return;
      const group = segments.slice(0, index).join(".");
      const indexes = numericGroups.get(group) || new Set();
      indexes.add(Number(segment));
      numericGroups.set(group, indexes);
    });
  }

  for (const [group, indexes] of numericGroups) {
    const ordered = [...indexes].sort((left, right) => left - right);
    ordered.forEach((value, index) => {
      if (value !== index) {
        throw new Error(`${description} list ${group} must use contiguous indexes from 0`);
      }
    });
  }
}

function frontmatterId(file) {
  const contents = fs.readFileSync(file, "utf8");
  const match = contents.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/);
  const id = match && match[1].match(/^id:\s*(.+)\s*$/m);
  return id ? id[1].trim() : null;
}

function sidebarDocumentIds(value, result = new Set()) {
  if (Array.isArray(value)) {
    for (const entry of value) sidebarDocumentIds(entry, result);
    return result;
  }
  if (typeof value === "string") {
    result.add(value);
    return result;
  }
  if (!value || typeof value !== "object") return result;

  if (typeof value.id === "string") result.add(value.id);
  if (Array.isArray(value.ids)) sidebarDocumentIds(value.ids, result);
  for (const [key, entry] of Object.entries(value)) {
    if (
      key !== "id" &&
      key !== "ids" &&
      key !== "label" &&
      key !== "type" &&
      entry &&
      typeof entry === "object"
    ) {
      sidebarDocumentIds(entry, result);
    }
  }
  return result;
}

const defaultRoot = path.join(contentRoot, defaultLocale.code);
const defaultDocs = path.join(defaultRoot, "docs");
const defaultDocFiles = relativeFiles(defaultDocs);
const defaultMarketing = require(path.join(defaultRoot, "marketing.json"));
const defaultMarketingKeys = Object.keys(defaultMarketing).sort();
const defaultDocsUi = require(path.join(defaultRoot, "docs-ui.json"));
const defaultDocsUiKeys = Object.keys(defaultDocsUi).sort();
const sidebar = require(path.join(root, "docs-site", "sidebars.js"));
const sidebarIds = sidebarDocumentIds(sidebar);
const categories = sidebar.docs.filter((entry) => entry.type === "category");
assertSameList(
  Object.keys(defaultDocsUi).filter((key) => key.startsWith("sidebar.")).sort(),
  categories.map(({ label }) => `sidebar.${label}`).sort(),
  "Sidebar category translations",
);
const defaultMarkdownFiles = defaultDocFiles.filter((file) => file.endsWith(".md"));
const documentIds = new Set(
  defaultMarkdownFiles.map((relative) => relative.slice(0, -".md".length)),
);
const sourceIds = new Map();

for (const relative of defaultMarkdownFiles) {
  const id = frontmatterId(path.join(defaultDocs, relative));
  if (!id) {
    throw new Error(`${defaultLocale.code}/${relative} is missing a frontmatter ID`);
  }
  sourceIds.set(relative, id);
}

assertFlatStringCatalog(defaultMarketing, `${defaultLocale.code} marketing catalog`);
assertFlatStringCatalog(defaultDocsUi, `${defaultLocale.code} documentation UI catalog`);
assertSameList([...sidebarIds].sort(), [...documentIds].sort(), "Sidebar document IDs");

const translatedLocales = enabledLocales.filter((locale) => !locale.default);
for (const locale of translatedLocales) {
  const localeRoot = path.join(contentRoot, locale.code);
  const docs = path.join(localeRoot, "docs");
  const marketing = require(path.join(localeRoot, "marketing.json"));
  const docsUi = require(path.join(localeRoot, "docs-ui.json"));
  const docFiles = relativeFiles(docs);

  assertSameList(docFiles, defaultDocFiles, `${locale.code} documentation files`);
  assertSameList(Object.keys(marketing).sort(), defaultMarketingKeys, `${locale.code} marketing keys`);
  assertSameList(Object.keys(docsUi).sort(), defaultDocsUiKeys, `${locale.code} documentation UI keys`);
  assertFlatStringCatalog(marketing, `${locale.code} marketing catalog`);
  assertFlatStringCatalog(docsUi, `${locale.code} documentation UI catalog`);

  for (const [relative, sourceId] of sourceIds) {
    const localeId = frontmatterId(path.join(docs, relative));
    if (sourceId !== localeId) {
      throw new Error(`${locale.code}/${relative} has a different frontmatter ID`);
    }
  }

  for (const key of defaultMarketingKeys.filter(
    (key) => key.endsWith(".key") || key.endsWith(".status"),
  )) {
    if (marketing[key] !== defaultMarketing[key]) {
      throw new Error(`${locale.code} changes structural marketing value ${key}`);
    }
  }
}

const generatedI18n = path.join(root, "docs-site", "i18n");

fs.rmSync(generatedI18n, { recursive: true, force: true });
fs.mkdirSync(generatedI18n, { recursive: true });

function writeCatalog(file, messages) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    `${JSON.stringify(
      Object.fromEntries(
        Object.entries(messages).map(([id, message]) => [id, { message }]),
      ),
      null,
      2,
    )}\n`,
  );
}

for (const locale of translatedLocales) {
  const localeRoot = path.join(contentRoot, locale.code);
  const localeI18n = path.join(generatedI18n, locale.code);
  const docsI18n = path.join(localeI18n, "docusaurus-plugin-content-docs");
  fs.cpSync(path.join(localeRoot, "docs"), path.join(docsI18n, "current"), {
    recursive: true,
    dereference: true,
  });

  const docsUi = require(path.join(localeRoot, "docs-ui.json"));
  const catalogs = toDocusaurusCatalogs(docsUi);
  writeCatalog(path.join(docsI18n, "current.json"), catalogs.docs);
  writeCatalog(
    path.join(localeI18n, "docusaurus-theme-classic", "navbar.json"),
    catalogs.navbar,
  );
  writeCatalog(
    path.join(localeI18n, "docusaurus-theme-classic", "footer.json"),
    catalogs.footer,
  );
}

console.log(`Prepared localized content for: ${enabledLocales.map((locale) => locale.code).join(", ")}`);
