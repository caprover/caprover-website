---
id: complete-webapp
title: Complete Web Application Tutorial
slug: /guides/complete-webapp
---

This example combines a public Node web app, a private worker, PostgreSQL, and a persistent upload directory. The web app accepts a small job; the worker marks it processed in PostgreSQL. **The endpoints have no authentication and are for a disposable learning environment.** Use a single-node server with enough memory for PostgreSQL and two Node services; a 1 GB host may be too small for concurrent image builds.

## 1. Create the private database

Complete [Getting Started](../get-started.md), including wildcard DNS and dashboard HTTPS. Create a CapRover app named `demo-db` with **Has Persistent Data** enabled and **Do not expose as web app** selected. Add a named volume `demo-db-data` at `/var/lib/postgresql/data`, the data path for the PostgreSQL 17 image. Set these app environment variables before the first deployment:

| Variable | Value |
| --- | --- |
| `POSTGRES_USER` | `demo` |
| `POSTGRES_DB` | `demo` |
| `POSTGRES_PASSWORD` | A unique strong password you save securely |

In the **Deployment** tab, deploy this image-only Captain Definition:

```json
{"schemaVersion":2,"imageName":"postgres:17-alpine"}
```

Wait until its service is running and its logs say it is ready for connections. Keep the database port `5432` private; there is no need to publish a host port. Changing `POSTGRES_PASSWORD` after the volume has been initialized does not change the existing database user's password.

## 2. Build the web and worker images

In a new local directory, create `package.json`:

```json
{"name":"caprover-multi-service-demo","version":"1.0.0","private":true,"type":"module","dependencies":{"pg":"8.11.5"}}
```

Create `web.mjs`. It uses the standard PostgreSQL environment variables, writes a job to the database, and stores one small upload at the mounted path:

```javascript
import http from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import pg from 'pg';

const pool = new pg.Pool();
pool.on('error', (error) => console.error('Database connection error:', error));
const upload = '/data/uploads/note.txt';
await mkdir('/data/uploads', { recursive: true });
await pool.query(`CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY, label TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE
)`);

async function readSmallBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) throw new Error('Body exceeds 4 KB');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/jobs') {
      const label = (await readSmallBody(req)).trim();
      if (!label) { res.writeHead(400).end('Empty job'); return; }
      const result = await pool.query(
        'INSERT INTO jobs (label) VALUES ($1) RETURNING id', [label]);
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result.rows[0]));
    } else if (req.method === 'GET' && req.url === '/jobs') {
      const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC LIMIT 10');
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result.rows));
    } else if (req.method === 'PUT' && req.url === '/upload') {
      await writeFile(upload, await readSmallBody(req));
      res.writeHead(204).end();
    } else if (req.method === 'GET' && req.url === '/upload') {
      const value = await readFile(upload, 'utf8').catch((error) => {
        if (error.code === 'ENOENT') return '';
        throw error;
      });
      res.writeHead(200, { 'content-type': 'text/plain' }).end(value);
    } else {
      res.writeHead(404).end();
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500).end();
  }
}).listen(3000, '0.0.0.0');
```

Create `worker.mjs` to process the jobs from the same database:

```javascript
import pg from 'pg';

const pool = new pg.Pool();
pool.on('error', (error) => console.error('Database connection error:', error));
async function processJobs() {
  try {
    const result = await pool.query(
      'UPDATE jobs SET processed = TRUE WHERE processed = FALSE RETURNING id');
    if (result.rowCount) console.log(`Processed ${result.rowCount} jobs`);
  } catch (error) {
    console.error('Worker will retry:', error);
  }
}

async function poll() {
  await processJobs();
  setTimeout(poll, 2000);
}
await poll();
```

Create these two Dockerfiles:

```dockerfile title="Dockerfile.web"
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY web.mjs ./
CMD ["node", "web.mjs"]
```

```dockerfile title="Dockerfile.worker"
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY worker.mjs ./
CMD ["node", "worker.mjs"]
```

Create two Captain Definition files in the same directory:

```json title="captain-definition-web"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.web"}
```

```json title="captain-definition-worker"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.worker"}
```

Run `npm install --package-lock-only` locally to create `package-lock.json`, then package the files. The build uses `npm ci`, so include the lock file in the archive:

```bash
npm install --package-lock-only
tar -cf deploy.tar package.json package-lock.json web.mjs worker.mjs \
  Dockerfile.web Dockerfile.worker captain-definition-web captain-definition-worker
```

## 3. Create, configure, and deploy the other apps

Create `demo-web` with **Has Persistent Data** enabled. Add a named volume `demo-uploads` at `/data/uploads`, set the container HTTP port to `3000`, and give it the database variables below. Create `demo-worker` as a non-web app with no volume and the same database variables:

| Variable | Value on both apps |
| --- | --- |
| `PGHOST` | `demo-db` |
| `PGPORT` | `5432` |
| `PGUSER` | `demo` |
| `PGDATABASE` | `demo` |
| `PGPASSWORD` | The same password set on `demo-db` |

New CapRover apps use their app name as the internal Docker service name; confirm the actual name with `docker service ls` if you are using a legacy app. In `demo-web`'s **Deployment** tab, set the Captain Definition Path to `./captain-definition-web` and upload `deploy.tar`. After the web app starts and creates the `jobs` table, set `demo-worker`'s Captain Definition Path to `./captain-definition-worker` and upload the same archive there. Inspect the build and service logs for both apps. The worker needs no public domain or port mapping.

Visit `http://demo-web.<root-domain>/jobs` and expect `[]`. Then enable HTTPS for `demo-web`, verify its certificate, and make these requests, replacing the example hostname:

```bash
curl -X POST --data 'first job' https://demo-web.apps.example.com/jobs
curl https://demo-web.apps.example.com/jobs
curl -X PUT --data 'saved upload' https://demo-web.apps.example.com/upload
curl https://demo-web.apps.example.com/upload
```

Refresh `/jobs` after a few seconds and check that the job has `processed: true`. The upload should say `saved upload`. Redeploy `demo-web` and verify the upload remains; restart `demo-db` and confirm the job is still listed. If either disappears, inspect the configured mount path and the node hosting that service.

## 4. Back up each data source

CapRover's [configuration backup](../server/backup/contents.md) does not contain `demo-db-data` or `demo-uploads`. Set up a PostgreSQL logical backup and a separate copy of the upload volume, store both off the host, and test restoration. See [Back Up Persistent Data](../data-persistence/backup-data.md). This tutorial keeps both stateful apps on a single node; [local volumes do not move with a Swarm task](../data-persistence/volumes.md). A production app also needs authentication, an upload policy, job claiming for multiple workers, and a deployment and database migration strategy.
