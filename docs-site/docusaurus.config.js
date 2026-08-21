const { themes: prismThemes } = require("prism-react-renderer");
const locales = require("../content/locales.json").filter(
  (locale) => locale.enabled,
);
const defaultLocale = locales.find((locale) => locale.default);

if (!defaultLocale) {
  throw new Error("An enabled default locale is required");
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "CapRover",
  tagline: "Scalable, Free and Self-hosted PaaS!",
  favicon: "img/favicon.ico",
  url: "https://caprover.com",
  baseUrl: "/",
  organizationName: "caprover",
  projectName: "caprover-website",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  future: {
    v4: true,
  },
  i18n: {
    defaultLocale: defaultLocale.code,
    locales: locales.map((locale) => locale.code),
    localeConfigs: Object.fromEntries(
      locales.map((locale) => [
        locale.code,
        {
          label: locale.label,
          htmlLang: locale.code,
          ...(locale.default ? {} : { path: locale.pathPrefix.slice(1) }),
        },
      ]),
    ),
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: "../content/en/docs",
          routeBasePath: "docs",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/caprover/caprover-website/edit/master/content/en/docs/",
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        pages: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  themeConfig: {
    image: "img/logo.png",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "CapRover",
      logo: {
        alt: "CapRover",
        src: "img/logo.png",
        href: "https://caprover.com/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          label: "Docs",
          position: "left",
        },
        { type: "localeDropdown", position: "right" },
        {
          href: "https://github.com/caprover/caprover",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA",
          label: "Slack Group",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [{ label: "Getting Started", to: "/docs/get-started" }],
        },
        {
          title: "Community",
          items: [
            { label: "X", href: "https://x.com/cap_rover" },
            {
              label: "Slack Group",
              href: "https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA",
            },
          ],
        },
        {
          title: "More",
          items: [
            { label: "GitHub", href: "https://github.com/caprover/caprover" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} githubsaturn`,
    },
    algolia: {
      appId: "BH4D9OD16A",
      apiKey: "81e546c2e0c9258e48c359465bde6909",
      indexName: "caprover",
      contextualSearch: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
