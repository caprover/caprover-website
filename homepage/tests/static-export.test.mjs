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
