import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const siteRoot = path.resolve("build/combined-site");

const contentTypes = new Map([
  [".css", "text/css"],
  [".gif", "image/gif"],
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".png", "image/png"],
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

    const contents = await readFile(target);
    response.writeHead(200, {
      "content-type": contentTypes.get(path.extname(target)) ?? "application/octet-stream",
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

  const homepageResponse = await fetch(`${origin}/`);
  assert.equal(homepageResponse.status, 200);
  const homepage = await homepageResponse.text();
  assert.match(homepage, /Deploy apps\./);

  const nextAsset = homepage.match(/(?:href|src)=["'](\/_next\/[^"']+\.(?:css|js))["']/)?.[1];
  assert(nextAsset, "Homepage does not reference a Next.js CSS or JavaScript asset");

  const checks = await Promise.all([
    fetch(`${origin}/.nojekyll`),
    fetch(`${origin}/docs/get-started.html`),
    fetch(`${origin}/homepage-assets/caprover-dashboard.png`),
    fetch(`${origin}${nextAsset}`),
  ]);

  for (const response of checks) {
    assert.equal(response.status, 200, `${response.url} did not return HTTP 200`);
  }

  assert.equal(await checks[0].text(), "", ".nojekyll must be empty");
  const docs = await checks[1].text();
  assert.match(docs, /Getting Started/i);
  assert(Number(checks[2].headers.get("content-length") ?? 0) > 0 || (await checks[2].arrayBuffer()).byteLength > 0);

  console.log("Combined site HTTP smoke test passed");
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
