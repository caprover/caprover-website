const fs = require("fs");
const path = require("path");

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

for (const locale of enabledLocales) {
  if (!locale.code || !locale.label || localeCodes.has(locale.code)) {
    throw new Error(`Invalid or duplicate locale: ${locale.code}`);
  }
  localeCodes.add(locale.code);
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

function frontmatterId(file) {
  const contents = fs.readFileSync(file, "utf8");
  const match = contents.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/);
  const id = match && match[1].match(/^id:\s*(.+)\s*$/m);
  return id ? id[1].trim() : null;
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
const defaultHomepage = require(path.join(defaultRoot, "homepage.json"));
const defaultHomepageKeys = Object.keys(defaultHomepage).sort();
const defaultDocsUi = require(path.join(defaultRoot, "docs-ui.json"));
const defaultDocsUiKeys = objectKeys(defaultDocsUi, "");

for (const locale of enabledLocales) {
  const localeRoot = path.join(contentRoot, locale.code);
  const docs = path.join(localeRoot, "docs");
  const homepage = require(path.join(localeRoot, "homepage.json"));
  const docsUi = require(path.join(localeRoot, "docs-ui.json"));
  const docFiles = relativeFiles(docs);

  assertSameList(docFiles, defaultDocFiles, `${locale.code} documentation files`);
  assertSameList(Object.keys(homepage).sort(), defaultHomepageKeys, `${locale.code} homepage keys`);
  assertSameList(objectKeys(docsUi, ""), defaultDocsUiKeys, `${locale.code} documentation UI keys`);

  for (const relative of docFiles.filter((file) => file.endsWith(".md"))) {
    const sourceId = frontmatterId(path.join(defaultDocs, relative));
    const localeId = frontmatterId(path.join(docs, relative));
    if (sourceId !== localeId) {
      throw new Error(`${locale.code}/${relative} has a different frontmatter ID`);
    }
  }

  for (const key of defaultHomepageKeys.filter(
    (key) => key.endsWith(".key") || key.endsWith(".status"),
  )) {
    if (homepage[key] !== defaultHomepage[key]) {
      throw new Error(`${locale.code} changes structural homepage value ${key}`);
    }
  }
}

const generatedDocs = path.join(root, "docs");
const generatedTranslations = path.join(root, "website", "translated_docs");
const generatedDocsUi = path.join(root, "website", "i18n");

removeDirectory(generatedDocs);
removeDirectory(generatedTranslations);
removeDirectory(generatedDocsUi);
copyDirectory(defaultDocs, generatedDocs);
fs.mkdirSync(generatedTranslations, { recursive: true });
fs.mkdirSync(generatedDocsUi, { recursive: true });

for (const locale of enabledLocales) {
  const localeRoot = path.join(contentRoot, locale.code);
  if (!locale.default) {
    copyDirectory(
      path.join(localeRoot, "docs"),
      path.join(generatedTranslations, locale.code),
    );
  }
  fs.copyFileSync(
    path.join(localeRoot, "docs-ui.json"),
    path.join(generatedDocsUi, `${locale.code}.json`),
  );
}

console.log(`Prepared localized content for: ${enabledLocales.map((locale) => locale.code).join(", ")}`);
