import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {
  contentIds,
  localTarget,
  normalizeRoute,
  renderRedirect,
  resolveRedirect,
  routeCatalog,
  readJson,
} from "./docs-redirects.mjs";
const entry = {
  source: "/docs/old",
  locale: "en",
  target: "/docs/new#source-old",
  fragments: {
    old: { target: "/docs/new#equivalent" },
    removed: { target: "/docs-legacy/old#removed" },
    中文: { target: "/docs/new#中文" },
    "a&b": { target: "/docs/new#a%26b" },
  },
};
for (const [description, input, expected] of [
  [
    "English old URL without fragment",
    "/docs/old.html",
    "/docs/new#source-old",
  ],
  ["equivalent fragment", "/docs/old#old", "/docs/new#equivalent"],
  ["archive-only fragment", "/docs/old#removed", "/docs-legacy/old#removed"],
  ["query string", "/docs/old?utm=1&x=2#old", "/docs/new?utm=1&x=2#equivalent"],
  ["encoded fragment", "/docs/old#%6fld", "/docs/new#equivalent"],
  [
    "non-ASCII fragment",
    "/docs/old#%E4%B8%AD%E6%96%87",
    "/docs/new#%E4%B8%AD%E6%96%87",
  ],
  ["unusual fragment", "/docs/old#a%26b", "/docs/new#a%26b"],
  ["unknown fragment", "/docs/old#unknown", "/docs/new#unknown"],
  ["invalid encoding", "/docs/old#%E0%A4%A", "/docs/new#%E0%A4%A"],
  ["empty fragment", "/docs/old#", "/docs/new#source-old"],
  ["trailing slash", "/docs/old/", "/docs/new#source-old"],
])
  test(description, () =>
    assert.equal(resolveRedirect(entry, input), expected),
  );
test("current valid canonical fragment is retained", () => {
  assert.equal(
    resolveRedirect(
      { ...entry, target: "/docs/new", fragments: {} },
      "/docs/new#current",
    ),
    "/docs/new#current",
  );
});
for (const locale of ["es-ES", "zh-CN"])
  test(locale + " locale and archive selection", () => {
    const translated = {
      ...entry,
      target: `/${locale}/docs/new`,
      fragments: { removed: { target: `/${locale}/docs-legacy/old#removed` } },
    };
    assert.equal(
      resolveRedirect(translated, "/docs/old"),
      `/${locale}/docs/new`,
    );
    assert.equal(
      resolveRedirect(translated, "/docs/old#removed"),
      `/${locale}/docs-legacy/old#removed`,
    );
  });
test("route variants normalize consistently", () => {
  for (const p of [
    "/docs/old",
    "/docs/old/",
    "/docs/old.html",
    "/docs/old/index.html",
  ])
    assert.equal(normalizeRoute(p), "/docs/old");
});
test("destinations and paths cannot become external or traverse directories", () => {
  for (const p of [
    "https://evil.test/x",
    "//evil.test/x",
    "/\\evil.test/x",
    "/a/../b",
    "/a?b",
  ])
    assert.throws(() => localTarget(p));
  assert.throws(() =>
    resolveRedirect({ ...entry, target: "https://evil.test/" }, "/docs/old"),
  );
});
test("untrusted hashes cannot inject HTML or destinations", () => {
  assert.equal(
    resolveRedirect(entry, "/docs/old#//evil.test"),
    " /docs/new#//evil.test".trim(),
  );
  const html = renderRedirect({
    ...entry,
    fragments: { "</script>": { target: "/docs/new#safe" } },
  });
  assert(!html.includes('"</script>"'));
  let target;
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], {
    URL,
    window: {
      location: {
        href: "https://caprover.com/docs/old#old",
        replace: (v) => (target = v),
      },
    },
  });
  assert.equal(target, "/docs/new#old");
  assert.match(html, /<noscript><meta http-equiv="refresh"/);
});
test("rendered article IDs include explicit and localized aliases; duplicate aliases fail", () => {
  assert.deepEqual(
    contentIds(
      '<article><h2 id="中文">x</h2><span id=a&amp;b></span><span id="odd&#39;id"></span></article>',
    ),
    ["a&b", "odd'id", "中文"],
  );
  assert.throws(() =>
    contentIds('<article><span id="x"></span><h2 id=x>x</h2></article>'),
  );
});
test("route catalog rejects duplicate sources and unsafe destinations", async () => {
  const catalog = await readJson("DOCS_CONSOLIDATION_MAP.json");
  const locales = (await readJson("content/locales.json")).filter(
    (l) => l.enabled,
  );
  assert.throws(() =>
    routeCatalog(
      {
        ...catalog,
        previewRoutes: [...catalog.previewRoutes, catalog.previewRoutes[0]],
      },
      locales,
    ),
  );
  assert.throws(() =>
    routeCatalog(
      {
        ...catalog,
        legacyEnglishRoutes: [
          { legacy: "/docs/bad", newCanonical: "//evil.test", source: "bad" },
        ],
      },
      locales,
    ),
  );
});

test("cycles and redirect chains are rejected before output is published", async () => {
  const { validateFinalTargets } = await import("./docs-redirects.mjs");
  assert.throws(
    () =>
      validateFinalTargets(
        [
          { target: "/b", fragments: {} },
          { target: "/a", fragments: {} },
        ],
        new Set(["/docs/current"]),
      ),
    /cycle or non-final/,
  );
  assert.throws(
    () =>
      validateFinalTargets(
        [{ target: "/docs/current", fragments: { old: { target: "/b#old" } } }],
        new Set(["/docs/current"]),
      ),
    /cycle or non-final/,
  );
});
test("regression: missing final heading and missing translated output fail the build", async () => {
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const { buildManifest, writeJson } = await import("./docs-redirects.mjs");
  const root = await mkdtemp(path.join(tmpdir(), "docs-compat-test-"));
  const site = path.join(root, "site");
  try {
    await writeJson(path.join(root, "DOCS_CONSOLIDATION_MAP.json"), {
      sections: [{ pages: [{ target: "current" }] }],
      legacyEnglishRoutes: [
        { legacy: "/docs/old", newCanonical: "/docs/current" },
      ],
      previewRoutes: [],
      addedAfterOriginalConsolidation: [],
    });
    await writeJson(path.join(root, "content/locales.json"), [
      { code: "en", enabled: true, default: true, pathPrefix: "" },
      { code: "es-ES", enabled: true, pathPrefix: "/es-ES" },
    ]);
    await writeJson(path.join(root, "docs-compat/historical-anchors.json"), {
      pages: {
        "/docs/old": { ids: ["old-heading"] },
        "/es-ES/docs/old": { ids: ["old-heading"] },
      },
    });
    const overrides = { routes: {}, previewFallbacks: {} };
    await writeJson(
      path.join(root, "docs-compat/anchor-overrides.json"),
      overrides,
    );
    for (const prefix of ["", "/es-ES"])
      for (const dir of ["/docs", "/docs-legacy"]) {
        const file = path.join(
          site,
          prefix,
          dir,
          dir === "/docs" ? "current.html" : "old.html",
        );
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(
          file,
          '<article><h2 id="' +
            (dir === "/docs" ? "new-heading" : "old-heading") +
            '">Heading</h2></article>',
        );
      }
    await buildManifest(root, site); // A known missing current heading safely uses the archive.
    overrides.routes["/docs/old"] = {
      "old-heading": {
        target: "/docs/current#missing-heading",
        policy: "equivalent",
        reason: "Test erroneous mapping",
      },
    };
    await writeJson(
      path.join(root, "docs-compat/anchor-overrides.json"),
      overrides,
    );
    await assert.rejects(buildManifest(root, site), /Missing target anchor/);
    overrides.routes = {};
    await writeJson(
      path.join(root, "docs-compat/anchor-overrides.json"),
      overrides,
    );
    await rm(path.join(site, "es-ES/docs/current.html"));
    await assert.rejects(buildManifest(root, site), /ENOENT/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("canonical output collisions fail, while overlapping canonical HTML stays intact", async () => {
  const { mkdtemp, mkdir, writeFile, readFile, rm } =
    await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const { writeCompatibility } = await import("./docs-redirects.mjs");
  const root = await mkdtemp(path.join(tmpdir(), "docs-output-test-"));
  try {
    const file = path.join(root, "docs/current.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, "<article>Canonical content</article>");
    const route = {
      source: "/docs/current",
      locale: "en",
      target: "/docs/current",
      fragments: {},
      currentIds: [],
    };
    await assert.rejects(
      writeCompatibility(root, { routes: [route] }),
      /Output already exists/,
    );
    await writeCompatibility(root, { routes: [{ ...route, canonical: true }] });
    assert.equal(
      await readFile(file, "utf8"),
      "<article>Canonical content</article>",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
