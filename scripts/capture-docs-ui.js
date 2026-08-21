const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const locales = require(path.join(root, "content", "locales.json"));
const defaultLocale = locales.find((locale) => locale.enabled && locale.default);

if (!defaultLocale) {
  throw new Error("An enabled default locale is required");
}

const generated = path.join(root, "docs-site", "i18n", `${defaultLocale.code}.json`);
const canonical = path.join(root, "content", defaultLocale.code, "docs-ui.json");

if (!fs.existsSync(generated)) {
  throw new Error(`Generated documentation UI catalog is missing: ${generated}`);
}

fs.copyFileSync(generated, canonical);
console.log(`Updated ${path.relative(root, canonical)}`);
