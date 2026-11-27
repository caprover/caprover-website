import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const expectedAssets = [
  "caprover-runtime-status.webp",
  "caprover-active-deployment.webp",
  "caprover-logo.png",
  "slack-icon.png",
  "one-click/wordpress.svg",
  "one-click/postgres.png",
  "one-click/redis.png",
  "one-click/nextcloud.png",
  "one-click/n8n-io.png",
  "one-click/uptime-kuma.png",
];
const legacyAssets = [
  "caprover-deployment-history.png",
  "caprover-dashboard.png",
  "caprover-architecture.png",
  "caprover-tutorial.gif",
  "caprover-workflow.png",
];
const routeManifest = JSON.parse(await readFile("routes.json", "utf8"));
const routeTitleKeys = {
  home: "homepage.hero.titleLine1",
  comparisonHub: "comparisonPages.hub.hero.title",
  coolify: "comparisonPages.coolify.hero.title",
  dokploy: "comparisonPages.dokploy.hero.title",
  dokku: "comparisonPages.dokku.hero.title",
};
const routes = Object.entries(routeManifest).map(([name, route]) => ({
  path: route.path,
  titleKey: routeTitleKeys[name],
}));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = "homepage-assets";
const locales = JSON.parse(await readFile("../content/locales.json", "utf8"));
const enabledLocales = locales.filter((locale) => locale.enabled);
const defaultLocale = enabledLocales.find((locale) => locale.default);

assert(defaultLocale);

function localizedPath(locale, route) {
  return `${locale.pathPrefix}${route}`;
}

function outputFile(locale, route) {
  return `out${localizedPath(locale, route)}index.html`;
}

async function readCatalog(locale) {
  return JSON.parse(
    await readFile(`../content/${locale.code}/marketing.json`, "utf8"),
  );
}

test("exports complete localized website routes", async () => {
  const defaultHtml = await readFile("out/index.html", "utf8");
  const defaultAlias = await readFile(
    `out/${defaultLocale.code}/index.html`,
    "utf8",
  );

  for (const locale of enabledLocales) {
    const catalog = await readCatalog(locale);
    for (const route of routes) {
      const html = await readFile(outputFile(locale, route.path), "utf8");
      assert(
        html.includes(catalog[route.titleKey]),
        `${locale.code}${route.path} is missing localized content`,
      );
      assert(
        html.includes(
          `https://caprover.com${localizedPath(locale, route.path)}`,
        ),
        `${locale.code}${route.path} is missing its canonical URL`,
      );
    }

    const homepage = await readFile(outputFile(locale, "/"), "utf8");
    assert.match(homepage, /class="newsletter-form"/);
    assert.match(
      homepage,
      /action="https:\/\/app\.kit\.com\/forms\/10091348\/subscriptions"/,
    );
    assert.doesNotMatch(homepage, /caprover\.kit\.com|ck\.5\.js/);
    assert.match(homepage, /class="collective-button"/);
    assert.doesNotMatch(
      homepage,
      /opencollective\.com\/caprover\/donate\/button/,
    );
    assert.match(
      homepage,
      /class="shiki shiki-themes github-light github-dark"/,
    );
    assert.match(homepage, /--shiki-light:/);
    assert.match(homepage, /--shiki-dark:/);
    assert.match(homepage, /class="copy-button"/);
    assert.match(homepage, /class="capability-strip"/);
    assert.match(homepage, /class="control-cards"/);
    assert.match(homepage, /<ul class="featured-apps">/);
    assert.match(
      homepage,
      /id="one-click-apps"[\s\S]*id="app-controls-title"[\s\S]*id="deployment-examples-title"/,
    );
    assert(homepage.includes(catalog["homepage.oneClick.title"]));
    assert(homepage.includes(catalog["homepage.deploymentExamples.workflows"]));
    assert.doesNotMatch(homepage, /deployment-playback|workflow-grid/);
    assert.match(homepage, /Dockerfile/);
    assert.match(homepage, /CI\/CD/);
    assert.match(homepage, /client_max_body_size 1g;/);
    assert.match(homepage, /MemoryBytes: 536870912/);
    assert.doesNotMatch(
      homepage,
      /hero-proofs|deployment-path-index|demo-nodejs\.server\.demo\.caprover\.com/,
    );
    assert.match(homepage, /<dl class="operations-list">/);
    assert.match(homepage, /id="features"/);
    assert.match(homepage, /caprover deploy/);
    assert.match(homepage, /caprover-runtime-status\.webp/);
    const hero = homepage.match(
      /<section class="hero shell"[\s\S]*?<\/section>/,
    )?.[0];
    assert(hero);
    assert.match(hero, /caprover-active-deployment\.webp/);
    assert.match(hero, /caprover-active-deployment-mobile\.webp/);
    assert.doesNotMatch(hero, /caprover deploy|client_max_body_size/);
    for (const asset of legacyAssets) {
      assert(
        !homepage.includes(`/${asset}`),
        `${locale.code} references ${asset}`,
      );
    }
    assert.doesNotMatch(homepage, /list-manage\.com\/subscribe\/post/);
    assert(
      homepage.includes(
        `https://caprover.com${locale.pathPrefix}/docs/get-started`,
      ),
    );
    assert.doesNotMatch(
      homepage,
      /compare-callout|hero-compare-link|Coolify|Dokploy/i,
    );
    assert(
      !homepage.includes(
        `href="${basePath}${localizedPath(locale, routeManifest.comparisonHub.path)}"`,
      ),
    );
    assert(
      homepage.includes(
        `href="https://caprover.com${locale.pathPrefix}/docs/deployments"`,
      ),
    );
    for (const targetLocale of enabledLocales) {
      assert(homepage.includes(`hrefLang="${targetLocale.code}"`));
    }
  }

  assert(defaultAlias.includes(defaultLocale.code));
  assert(defaultAlias.includes("noindex, follow"));

  await Promise.all(
    [
      ...expectedAssets,
      ...legacyAssets,
      "caprover-active-deployment-mobile.webp",
    ].map((asset) => access(`out/${assetPath}/${asset}`)),
  );

  for (const asset of expectedAssets) {
    assert.match(
      defaultHtml,
      new RegExp(`(?:href|src)=["']${basePath}/${assetPath}/${asset}["']`),
    );
  }

  if (basePath) {
    assert.match(defaultHtml, new RegExp(`href=["']${basePath}/_next/`));
  }
});

test("keeps comparison regressions covered across locales", async () => {
  const hub = await readFile(
    `out${routeManifest.comparisonHub.path}index.html`,
    "utf8",
  );
  const coolify = await readFile(
    `out${routeManifest.coolify.path}index.html`,
    "utf8",
  );
  const dokploy = await readFile(
    `out${routeManifest.dokploy.path}index.html`,
    "utf8",
  );
  const dokku = await readFile(
    `out${routeManifest.dokku.path}index.html`,
    "utf8",
  );
  const sitemap = await readFile("out/sitemap.xml", "utf8");

  assert.match(dokku, /SIMPLE BY DEFAULT/);
  assert.match(hub, /SMALL-SERVER FRIENDLY/);
  assert.match(hub, /status-yes/);
  assert.match(coolify, /CAPROVER VS COOLIFY/);
  assert.match(dokploy, /CAPROVER VS DOKPLOY/);
  assert.match(dokku, /CAPROVER VS DOKKU/);

  for (const matchup of [coolify, dokploy, dokku]) {
    assert.match(matchup, /SMALL-SERVER FRIENDLY/);
    assert.match(matchup, /status-yes/);
    assert.doesNotMatch(matchup, /Raw Docker ServiceUpdate override/);
  }
  for (const comparisonPage of [hub, coolify, dokploy, dokku]) {
    assert.match(
      comparisonPage,
      /This comparison table was generated by an AI agent/,
    );
    assert.match(comparisonPage, /mailto:marketing@caprover\.com/);
  }
  assert.doesNotMatch(coolify, /Moving to Coolify/);
  assert.doesNotMatch(dokploy, /Moving to Dokploy/);
  assert.doesNotMatch(dokku, /Moving to Dokku/);

  for (const locale of enabledLocales) {
    const catalog = await readCatalog(locale);
    for (const route of [
      routeManifest.comparisonHub,
      routeManifest.coolify,
      routeManifest.dokploy,
    ]) {
      const html = await readFile(outputFile(locale, route.path), "utf8");
      assert(html.includes(catalog["comparisonCommon.workflow.title"]));
      assert(html.includes("caprover deploy -d"));
      if (route !== routeManifest.coolify)
        assert(html.includes("https://docs.dokploy.com/docs/core/providers"));
      if (route !== routeManifest.dokploy)
        assert(
          html.includes(
            "https://coolify.io/docs/applications/builds/dockerfile",
          ),
        );
    }
    for (const route of routes) {
      assert(
        sitemap.includes(
          `https://caprover.com${localizedPath(locale, route.path)}`,
        ),
      );
    }
  }
});

test("ships zero Shiki syntax-highlighter code to client JS chunks", async () => {
  async function listJsFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await listJsFiles(fullPath)));
      } else if (entry.name.endsWith(".js")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const chunkFiles = await listJsFiles("out/_next/static/chunks");
  assert(chunkFiles.length > 0, "Expected client JS chunks in static export");
  for (const file of chunkFiles) {
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(
      content,
      /createHighlighter|shiki-themes|vscode-oniguruma|onig\.wasm/i,
      `Client chunk ${file} must not bundle Shiki runtime code`,
    );
  }
});

test("enabled marketing catalogs preserve source keys and structural values", async () => {
  const source = await readCatalog(defaultLocale);

  for (const locale of enabledLocales) {
    const catalog = await readCatalog(locale);
    assert.deepEqual(Object.keys(catalog).sort(), Object.keys(source).sort());
    for (const [key, value] of Object.entries(source)) {
      if (key.endsWith(".key") || key.endsWith(".status")) {
        assert.equal(catalog[key], value, `${locale.code}: ${key}`);
      }
    }
  }
});
