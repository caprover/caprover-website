const fs = require("fs");
const path = require("path");
const { fromDocusaurusCatalogs } = require("./docs-ui-catalogs");

const root = path.resolve(__dirname, "..");
const locales = require(path.join(root, "content", "locales.json"));
const defaultLocale = locales.find((locale) => locale.enabled && locale.default);

if (!defaultLocale) {
  throw new Error("An enabled default locale is required");
}

const canonical = path.join(root, "content", defaultLocale.code, "docs-ui.json");

function readCatalog(...parts) {
  const file = path.join(
    root,
    "docs-site",
    "i18n",
    defaultLocale.code,
    ...parts,
  );
  if (!fs.existsSync(file)) {
    throw new Error(`Generated documentation UI catalog is missing: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const docs = readCatalog("docusaurus-plugin-content-docs", "current.json");
const navbar = readCatalog("docusaurus-theme-classic", "navbar.json");
const footer = readCatalog("docusaurus-theme-classic", "footer.json");
const result = fromDocusaurusCatalogs({ docs, navbar, footer });

fs.writeFileSync(canonical, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Updated ${path.relative(root, canonical)}`);
