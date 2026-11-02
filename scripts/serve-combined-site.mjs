// Small local GitHub Pages-style server for browser navigation tests.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("build/combined-site");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
createServer(async (req, res) => {
  const pathname = decodeURI(new URL(req.url, "http://localhost").pathname);
  const target = path.resolve(root, "." + pathname);
  if (!target.startsWith(root + "/") && target !== root)
    return res.writeHead(403).end();
  for (const file of [
    target,
    target + ".html",
    path.join(target, "index.html"),
  ]) {
    try {
      const bytes = await readFile(file);
      res
        .writeHead(200, {
          "content-type":
            types[path.extname(file)] ?? "application/octet-stream",
        })
        .end(bytes);
      return;
    } catch {
      /* Try the static host's next path convention. */
    }
  }
  res.writeHead(404).end();
}).listen(4173, "127.0.0.1");
