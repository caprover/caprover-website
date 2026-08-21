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

function objectKeys(value, prefix) {
  const keys = [];
  for (const key of Object.keys(value).sort()) {
    const current = prefix ? `${prefix}.${key}` : key;
    if (value[key] && typeof value[key] === "object" && !Array.isArray(value[key])) {
      keys.push(...objectKeys(value[key], current));
    } else {
      keys.push(current);
    }
  }
  return keys;
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

function removeDirectory(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory)) {
    const absolute = path.join(directory, entry);
    if (fs.statSync(absolute).isDirectory()) {
      removeDirectory(absolute);
    } else {
      fs.unlinkSync(absolute);
    }
  }
  fs.rmdirSync(directory);
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source)) {
    const from = path.join(source, entry);
    const to = path.join(destination, entry);
    if (fs.statSync(from).isDirectory()) {
      copyDirectory(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

const defaultRoot = path.join(contentRoot, defaultLocale.code);
const defaultDocs = path.join(defaultRoot, "docs");
const defaultDocFiles = relativeFiles(defaultDocs);
const defaultMarketing = require(path.join(defaultRoot, "marketing.json"));
const defaultMarketingKeys = Object.keys(defaultMarketing).sort();
const defaultDocsUi = require(path.join(defaultRoot, "docs-ui.json"));
const defaultDocsUiKeys = objectKeys(defaultDocsUi, "");
const sidebarIds = sidebarDocumentIds(
  require(path.join(root, "docs-site", "sidebars.js")),
);
const defaultMarkdownFiles = defaultDocFiles.filter((file) => file.endsWith(".md"));
const documentIds = new Set(
  defaultMarkdownFiles.map((relative) => relative.slice(0, -".md".length)),
);

for (const relative of defaultMarkdownFiles) {
  if (!frontmatterId(path.join(defaultDocs, relative))) {
    throw new Error(`${defaultLocale.code}/${relative} is missing a frontmatter ID`);
  }
}

assertFlatStringCatalog(defaultMarketing, `${defaultLocale.code} marketing catalog`);
assertSameList([...sidebarIds].sort(), [...documentIds].sort(), "Sidebar document IDs");

for (const locale of enabledLocales) {
  const localeRoot = path.join(contentRoot, locale.code);
  const docs = path.join(localeRoot, "docs");
  const marketing = require(path.join(localeRoot, "marketing.json"));
  const docsUi = require(path.join(localeRoot, "docs-ui.json"));
  const docFiles = relativeFiles(docs);

  assertSameList(docFiles, defaultDocFiles, `${locale.code} documentation files`);
  assertSameList(Object.keys(marketing).sort(), defaultMarketingKeys, `${locale.code} marketing keys`);
  assertSameList(objectKeys(docsUi, ""), defaultDocsUiKeys, `${locale.code} documentation UI keys`);
  assertFlatStringCatalog(marketing, `${locale.code} marketing catalog`);

  for (const relative of docFiles.filter((file) => file.endsWith(".md"))) {
    const sourceId = frontmatterId(path.join(defaultDocs, relative));
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

removeDirectory(generatedI18n);
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

for (const locale of enabledLocales) {
  const localeRoot = path.join(contentRoot, locale.code);
  if (!locale.default) {
    const localeI18n = path.join(generatedI18n, locale.code);
    copyDirectory(
      path.join(localeRoot, "docs"),
      path.join(
        localeI18n,
        "docusaurus-plugin-content-docs",
        "current",
      ),
    );

    const docsUi = require(path.join(localeRoot, "docs-ui.json"));
    const catalogs = toDocusaurusCatalogs(docsUi);
    writeCatalog(
      path.join(
        localeI18n,
        "docusaurus-plugin-content-docs",
        "current.json",
      ),
      catalogs.docs,
    );
    writeCatalog(
      path.join(localeI18n, "docusaurus-theme-classic", "navbar.json"),
      catalogs.navbar,
    );
    writeCatalog(
      path.join(localeI18n, "docusaurus-theme-classic", "footer.json"),
      catalogs.footer,
    );
  }
}

console.log(`Prepared localized content for: ${enabledLocales.map((locale) => locale.code).join(", ")}`);
