import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  buildManifest,
  contentIds,
  localTarget,
  normalizeRoute,
  renderRedirect,
  resolveRedirect,
  writeCompatibility,
  writeJson,
} from "./docs-redirects.mjs";
const entry = {
  source: "/docs/old",
  locale: "en",
  target: "/docs/new#source-old",
  fragments: {
    old: { target: "/docs/new#equivalent" },
    removed: { target: "/docs/new" },
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
  [
    "removed heading falls back to the page",
    "/docs/old?utm=1#removed",
    "/docs/new?utm=1",
  ],
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
test("the build checks every historical destination and heading", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "docs-compat-test-"));
  const site = path.join(root, "site");
  const compat = path.join(root, "docs-compat");
  const source = "/docs-legacy/old";
  const routes = [
    {
      source,
      evidence: "/docs/old",
      kind: "archive",
      locale: "en",
      canonical: false,
    },
  ];
  const inventory = { routes };
  const targets = { "/docs/old": "/docs/get-started" };
  const overrides = { routes: {}, previewFallbacks: {} };
  const output = path.join(site, "docs/get-started.html");
  try {
    await writeJson(path.join(compat, "historical-routes.json"), inventory);
    await writeJson(path.join(compat, "route-targets.json"), targets);
    await writeJson(path.join(compat, "anchor-overrides.json"), overrides);
    await writeJson(path.join(compat, "historical-anchors.json"), {
      pages: { "/docs/old": { ids: ["old-heading"] } },
    });
    await writeJson(path.join(root, "content/locales.json"), [
      { code: "en", enabled: true, pathPrefix: "" },
    ]);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(
      output,
      '<article><h2 id="current-heading">Heading</h2></article>',
    );
    await writeFile(
      path.join(site, "sitemap.xml"),
      "<urlset><url><loc>https://caprover.com/docs/get-started</loc></url></urlset>",
    );

    const { routes: manifest } = await buildManifest(root, site);
    assert.equal(
      manifest[0].fragments["old-heading"].target,
      "/docs/get-started",
    );

    overrides.routes["/docs/old"] = {
      "old-heading": "/docs/get-started#missing",
    };
    await writeJson(path.join(compat, "anchor-overrides.json"), overrides);
    await assert.rejects(buildManifest(root, site), /Missing target anchor/);
    await writeJson(path.join(compat, "anchor-overrides.json"), {
      ...overrides,
      routes: {},
    });

    targets["/docs/old"] = source;
    await writeJson(path.join(compat, "route-targets.json"), targets);
    await assert.rejects(
      buildManifest(root, site),
      /Redirect cycle, non-canonical destination/,
    );
    targets["/docs/old"] = "/docs/get-started";
    await writeJson(path.join(compat, "route-targets.json"), targets);

    await writeJson(path.join(compat, "historical-routes.json"), {
      routes: [...routes, ...routes],
    });
    await assert.rejects(buildManifest(root, site), /Duplicate source/);
    await writeJson(path.join(compat, "historical-routes.json"), inventory);

    await rm(output);
    await assert.rejects(buildManifest(root, site), /ENOENT/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("canonical output collisions fail, while overlapping canonical HTML stays intact", async () => {
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
