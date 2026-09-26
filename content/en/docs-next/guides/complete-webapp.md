---
id: complete-webapp
title: Complete Web Application Tutorial
slug: /guides/complete-webapp
---

This tutorial deploys a small HTTP application, saves a counter in a Docker volume, serves it over HTTPS, and verifies that the data survives a redeploy. It uses only Node's built-in modules, so the archive contains all source needed for the build. **The public counter has no authentication and is for learning, not production.**

## 1. Prepare CapRover

Complete [Getting Started](../get-started.md) through dashboard HTTPS. You need a working wildcard DNS record, ports 80 and 443, and access to the dashboard. On a single-node server, create a web app named `demo-counter` with **Has Persistent Data** enabled. In its configuration, add a named Docker volume `demo-counter-data` at the container path `/data`. Set the **Container HTTP Port** to `3000` and save.

## 2. Create the source

Make a local directory named `demo-counter`. Add `server.mjs`:

```javascript
import http from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const file = '/data/count.txt';
await mkdir('/data', { recursive: true });

const server = http.createServer(async (req, res) => {
  try {
    if (req.url !== '/' && req.url !== '/increment') {
      res.writeHead(404).end();
      return;
    }
    let count = Number(await readFile(file, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return '0';
      throw error;
    }));
    if (req.method === 'POST' && req.url === '/increment') {
      count += 1;
      await writeFile(file, String(count));
    } else if (req.method !== 'GET' || req.url !== '/') {
      res.writeHead(405).end();
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ count }));
  } catch (error) {
    console.error(error);
    res.writeHead(500).end();
  }
});

server.listen(3000, '0.0.0.0');
```

Add a `Dockerfile` and a file named `captain-definition`:

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY server.mjs .
CMD ["node", "server.mjs"]
```

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

## 3. Deploy and verify

From the directory containing these three files, make an archive:

```bash
tar -cf deploy.tar captain-definition Dockerfile server.mjs
```

In the app's **Deployment** tab, upload `deploy.tar` and wait for a successful build. Open `http://demo-counter.<root-domain>/` and expect `{"count":0}`. Enable HTTPS for the app after the HTTP route works, then run:

```bash
curl -X POST https://demo-counter.<root-domain>/increment
curl https://demo-counter.<root-domain>/
```

The second response should show `{"count":1}`. Redeploy the same archive, wait for the service to restart, and repeat the GET request. The count should still be 1 because `/data` is mounted. If it resets, inspect the app's volume and node placement before writing important data.

For a real web app, add authentication, input handling, tests, and a database or external object store as needed. A single-file counter is not safe for concurrent replicas. Back up the volume **separately** from [CapRover's configuration backup](../server/backup/contents.md); see [Back Up Persistent Data](../data-persistence/backup-data.md). To add a private worker or database, use [internal service networking](../domains/internal-networking.md) and keep its data on the intended node.

## Extend the example

Create a separate non-web app for a worker if you need background processing. Give it an image with a long-running worker process, environment variables for its dependencies, and no public HTTP route. For a database, choose a [One-Click App](../one-click-apps/index.md) or an external provider and use its internal service name from the web and worker containers. Store its credentials as app environment variables, keep its database port private, and arrange a database-specific backup. Add a public domain and HTTPS only to the web app. Test worker jobs and database writes after a service restart before adding replicas; node-local files and in-process sessions need a deliberate [scaling plan](../scaling/index.md).
