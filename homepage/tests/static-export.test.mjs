import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const expectedAssets = [
  "caprover-architecture.png",
  "caprover-dashboard.png",
  "caprover-logo.png",
  "caprover-tutorial.gif",
  "caprover-workflow.png",
  "slack-icon.png",
];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = "homepage-assets";

test("exports a complete static homepage", async () => {
  const html = await readFile("out/index.html", "utf8");

  assert.match(html, /<title>CapRover · Scalable, Free and Self-hosted PaaS<\/title>/);
  assert.match(html, /Deploy apps\./);

  await Promise.all(
    expectedAssets.map((asset) => access(`out/${assetPath}/${asset}`)),
  );

  for (const asset of expectedAssets) {
    assert.match(
      html,
      new RegExp(`(?:href|src)=["']${basePath}/${assetPath}/${asset}["']`),
    );
  }

  if (basePath) {
    assert.match(html, new RegExp(`href=["']${basePath}/_next/`));
  }
});


test("exports the comparison hub and one-on-one pages without changing homepage navigation", async () => {
  const homepage = await readFile("out/index.html", "utf8");
  const hub = await readFile("out/compare/index.html", "utf8");
  const coolify = await readFile("out/compare/coolify/index.html", "utf8");
  const dokploy = await readFile("out/compare/dokploy/index.html", "utf8");
  const dokku = await readFile("out/compare/dokku/index.html", "utf8");
  const sitemap = await readFile("out/sitemap.xml", "utf8");

  assert.doesNotMatch(homepage, /href=["'][^"']*\/compare\/?["']/);
  assert.match(hub, /Choose the deployment model/);
  assert.match(coolify, /CAPROVER VS COOLIFY/);
  assert.match(dokploy, /CAPROVER VS DOKPLOY/);
  assert.match(dokku, /CAPROVER VS DOKKU/);
  assert.match(sitemap, /https:\/\/caprover\.com\/compare\/coolify\//);
});
