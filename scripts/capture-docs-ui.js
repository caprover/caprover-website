const fs = require("fs");
const path = require("path");

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

function message(catalog, key) {
  if (!catalog[key] || typeof catalog[key].message !== "string") {
    throw new Error(`Generated documentation UI key is missing: ${key}`);
  }
  return catalog[key].message;
}

const docs = readCatalog("docusaurus-plugin-content-docs", "current.json");
const navbar = readCatalog("docusaurus-theme-classic", "navbar.json");
const footer = readCatalog("docusaurus-theme-classic", "footer.json");
const result = {
  "version.label": message(docs, "version.label"),
  "navbar.Docs": message(navbar, "item.label.Docs"),
  "navbar.GitHub": message(navbar, "item.label.GitHub"),
  "navbar.Slack Group": message(navbar, "item.label.Slack Group"),
  "footer.column.Docs": message(footer, "link.title.Docs"),
  "footer.column.Community": message(footer, "link.title.Community"),
  "footer.column.More": message(footer, "link.title.More"),
  "footer.Getting Started": message(
    footer,
    "link.item.label.Getting Started",
  ),
  "footer.X": message(footer, "link.item.label.X"),
  "footer.Slack Group": message(footer, "link.item.label.Slack Group"),
  "footer.GitHub": message(footer, "link.item.label.GitHub"),
};

for (const [key, value] of Object.entries(docs)) {
  const prefix = "sidebar.docs.category.";
  if (key.startsWith(prefix)) {
    result[`sidebar.${key.slice(prefix.length)}`] = value.message;
  }
}

fs.writeFileSync(canonical, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Updated ${path.relative(root, canonical)}`);
