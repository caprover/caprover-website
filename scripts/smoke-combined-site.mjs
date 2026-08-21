import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const siteRoot = path.resolve("build/combined-site");
const locales = JSON.parse(
  await readFile(path.resolve("content/locales.json"), "utf8"),
).filter((locale) => locale.enabled);
const localizedRoutes = [
  "",
  "compare/",
  "compare/coolify/",
  "compare/dokploy/",
  "compare/dokku/",
];

const contentTypes = new Map([
  [".css", "text/css"],
  [".gif", "image/gif"],
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".png", "image/png"],
  [".woff2", "font/woff2"],
]);

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const target = path.resolve(siteRoot, relative);

    if (target !== siteRoot && !target.startsWith(`${siteRoot}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }

    let contents;
    let resolved = target;
    for (const candidate of [target, `${target}.html`, path.join(target, "index.html")]) {
      try {
        contents = await readFile(candidate);
        resolved = candidate;
        break;
      } catch {
        // Try the next static-hosting path convention.
      }
    }
    if (!contents) throw new Error(`Static file is missing: ${pathname}`);
    response.writeHead(200, {
      "content-type": contentTypes.get(path.extname(resolved)) ?? "application/octet-stream",
    });
    response.end(contents);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

try {
  const address = server.address();
  assert(address && typeof address === "object");
  const origin = `http://127.0.0.1:${address.port}`;

  for (const locale of locales) {
    const marketingCatalog = JSON.parse(
      await readFile(
        path.resolve(`content/${locale.code}/marketing.json`),
        "utf8",
      ),
    );
    const docsSource = await readFile(
      path.resolve(`content/${locale.code}/docs/get-started.md`),
      "utf8",
    );
    const docsTitle = docsSource.match(/^title:\s*(.+)$/m)?.[1];
    assert(docsTitle, `${locale.code} documentation title is missing`);
    const outputPrefix = locale.pathPrefix ? `${locale.pathPrefix.slice(1)}/` : "";
    const routeResponses = await Promise.all(
      localizedRoutes.map((route) => fetch(`${origin}/${outputPrefix}${route}index.html`)),
    );
    const docsResponse = await fetch(
      `${origin}${locale.pathPrefix}/docs/get-started`,
    );

    for (const response of [...routeResponses, docsResponse]) {
      assert.equal(response.status, 200, `${response.url} did not return HTTP 200`);
    }

    const localizedHomepage = await routeResponses[0].text();
    assert(
      localizedHomepage.includes(marketingCatalog["homepage.hero.titleLine1"]),
      `${locale.code} homepage content is missing`,
    );
    const localizedDocs = await docsResponse.text();
    assert(localizedDocs.includes(docsTitle), `${locale.code} documentation content is missing`);
  }

  const homepageResponse = await fetch(`${origin}/`);
  assert.equal(homepageResponse.status, 200);
  const homepage = await homepageResponse.text();
  assert.match(homepage, /Deploy apps\./);

  const nextAsset = homepage.match(/(?:href|src)=["'](\/_next\/[^"']+\.(?:css|js))["']/)?.[1];
  assert(nextAsset, "Homepage does not reference a Next.js CSS or JavaScript asset");

  const checks = await Promise.all([
    fetch(`${origin}/.nojekyll`),
    fetch(`${origin}/docs/get-started.html`),
    fetch(`${origin}/docs/en/get-started.html`),
    fetch(`${origin}/docs/es-ES/get-started.html`),
    fetch(`${origin}/docs/get-started`),
    fetch(`${origin}/es-ES/docs/get-started`),
    fetch(`${origin}/en/index.html`),
    fetch(`${origin}/es-ES/index.html`),
    fetch(`${origin}/es-ES/compare/index.html`),
    fetch(`${origin}/es-ES/compare/coolify/index.html`),
    fetch(`${origin}/es-ES/compare/dokploy/index.html`),
    fetch(`${origin}/es-ES/compare/dokku/index.html`),
    fetch(`${origin}/homepage-assets/caprover-dashboard.png`),
    fetch(`${origin}${nextAsset}`),
    fetch(`${origin}/robots.txt`),
  ]);

  for (const response of checks) {
    assert.equal(response.status, 200, `${response.url} did not return HTTP 200`);
  }

  assert.equal(await checks[0].text(), "", ".nojekyll must be empty");
  const legacyEnglishDocsRedirect = await checks[2].text();
  assert.match(legacyEnglishDocsRedirect, /window\.location\.replace\(["']\/docs\/get-started["']/);
  const legacySpanishDocsRedirect = await checks[3].text();
  assert.match(legacySpanishDocsRedirect, /window\.location\.replace\(["']\/es-ES\/docs\/get-started["']/);

  const docs = await checks[4].text();
  assert.match(docs, /Getting Started/i);
  assert.match(docs, /href=["']?\/es-ES\/docs\/get-started(?:["'\s>])/);
  const spanishDocs = await checks[5].text();
  assert.match(spanishDocs, /<html lang=["']?es-ES(?:["'\s>])/);
  assert.match(spanishDocs, /Primeros pasos/);
  assert.match(spanishDocs, /Conceptos básicos/);
  assert.match(spanishDocs, /href=["']?\/docs\/get-started(?:["'\s>])/);
  const englishHomepageAlias = await checks[6].text();
  assert.match(englishHomepageAlias, /Deploy apps\./);
  assert.match(englishHomepageAlias, /rel=["']canonical["'][^>]+href=["']https:\/\/caprover\.com\/["']/);
  const spanishHomepage = await checks[7].text();
  assert.match(spanishHomepage, /Despliega aplicaciones\./);
  assert.match(spanishHomepage, /href=["']https:\/\/caprover\.com\/es-ES\/docs\/get-started["']/);
  assert.match(spanishHomepage, /<html lang=["']es-ES["']/);
  assert.match(spanishHomepage, /<main lang=["']es-ES["']/);
  assert.match(spanishHomepage, /rel=["']canonical["'][^>]+href=["']https:\/\/caprover\.com\/es-ES\/["']/);
  const spanishComparisonPages = await Promise.all(checks.slice(8, 12).map((response) => response.text()));
  assert.match(spanishComparisonPages[0], /Empieza de forma sencilla\./);
  for (const page of spanishComparisonPages) {
    assert.match(page, /\/es-ES\/compare\//);
    assert.match(page, /\/es-ES\/docs\/get-started/);
  }
  assert(Number(checks[12].headers.get("content-length") ?? 0) > 0 || (await checks[12].arrayBuffer()).byteLength > 0);
  assert.equal(
    await checks[14].text(),
    "User-agent: *\nAllow: /\nSitemap: https://caprover.com/sitemap.xml\n",
  );

  function docsStylesheet(html) {
    const match = html.match(
      /href=(?:["'](\/[^"']*assets\/css\/styles\.[^"']+\.css)["']|(\/[^\s>]*assets\/css\/styles\.[^\s>]+\.css))/,
    );
    const stylesheet = match?.[1] ?? match?.[2];
    assert(stylesheet, "Documentation stylesheet reference is missing");
    return stylesheet;
  }

  const docsCssContents = [];
  for (const html of [docs, spanishDocs]) {
    const stylesheet = docsStylesheet(html);
    const response = await fetch(`${origin}${stylesheet}`);
    assert.equal(response.status, 200);
    const css = await response.text();
    assert.match(css, /--caprover-blue\s*:\s*#155eef/i);
    assert.match(css, /font-family\s*:\s*["\']?Geist/i);
    docsCssContents.push(css);
  }

  const docsCss = docsCssContents[0];

  const geistAsset = docsCss.match(
    /url\(["\']?(\/_next\/static\/media\/[^"\')]+\.woff2)/,
  )?.[1];
  assert(geistAsset, "Documentation stylesheet does not reference a Geist font asset");

  const geistResponse = await fetch(`${origin}${geistAsset}`);
  assert.equal(
    geistResponse.status,
    200,
    `${geistResponse.url} did not return HTTP 200`,
  );

  console.log("Combined site HTTP smoke test passed");
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
