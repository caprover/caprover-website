const docsUiMappings = [
  ["docs", "version.label", "version.label"],
  ["navbar", "navbar.Docs", "item.label.Docs"],
  ["navbar", "navbar.GitHub", "item.label.GitHub"],
  ["navbar", "navbar.Slack Group", "item.label.Slack Group"],
  ["footer", "footer.column.Docs", "link.title.Docs"],
  ["footer", "footer.column.Community", "link.title.Community"],
  ["footer", "footer.column.More", "link.title.More"],
  ["footer", "footer.Getting Started", "link.item.label.Getting Started"],
  ["footer", "footer.X", "link.item.label.X"],
  ["footer", "footer.Slack Group", "link.item.label.Slack Group"],
  ["footer", "footer.GitHub", "link.item.label.GitHub"],
];

const docsUiSidebarPrefix = "sidebar.";
const docusaurusSidebarPrefix = "sidebar.docs.category.";

function toDocusaurusCatalogs(docsUi) {
  const catalogs = { docs: {}, navbar: {}, footer: {} };

  for (const [catalog, docsUiKey, docusaurusKey] of docsUiMappings) {
    catalogs[catalog][docusaurusKey] = docsUi[docsUiKey];
  }

  for (const [key, value] of Object.entries(docsUi)) {
    if (key.startsWith(docsUiSidebarPrefix)) {
      catalogs.docs[
        `${docusaurusSidebarPrefix}${key.slice(docsUiSidebarPrefix.length)}`
      ] = value;
    }
  }

  return catalogs;
}

function fromDocusaurusCatalogs(catalogs) {
  const docsUi = {};

  function message(catalog, key) {
    if (!catalog[key] || typeof catalog[key].message !== "string") {
      throw new Error(`Generated documentation UI key is missing: ${key}`);
    }
    return catalog[key].message;
  }

  for (const [catalog, docsUiKey, docusaurusKey] of docsUiMappings) {
    docsUi[docsUiKey] = message(catalogs[catalog], docusaurusKey);
  }

  for (const [key, value] of Object.entries(catalogs.docs)) {
    if (key.startsWith(docusaurusSidebarPrefix)) {
      docsUi[`${docsUiSidebarPrefix}${key.slice(docusaurusSidebarPrefix.length)}`] =
        value.message;
    }
  }

  return docsUi;
}

module.exports = { fromDocusaurusCatalogs, toDocusaurusCatalogs };
