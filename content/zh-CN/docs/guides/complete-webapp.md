---
id: complete-webapp
title: 完整 Web 应用部署教程
slug: /guides/complete-webapp
---

- 本示例包含一个对外提供服务的 Node.js Web 应用、一个内部 worker、PostgreSQL，以及用于上传文件的持久化目录。
- Web 应用创建一个简单任务，worker 从数据库中处理任务并更新其状态。
- **示例 endpoint 没有身份验证，只适合可随时删除的学习环境。** 建议使用单节点服务器，并为 PostgreSQL 和两个 Node.js 服务预留足够内存。1 GB 内存可能不足以同时构建多个镜像。

## 1. 创建内部数据库

- 先完成[快速入门](../get-started.md)，包括通配符 DNS 和 dashboard HTTPS。
- 创建名为 `demo-db` 的 CapRover 应用，启用 **Has Persistent Data**，并选中 **Do not expose as web app**。
- 添加名为 `demo-db-data` 的数据卷，挂载到 `/var/lib/postgresql/data`，这是 PostgreSQL 17 镜像的数据目录。
- 首次部署前设置以下环境变量：

| 变量 | 值 |
| --- | --- |
| `POSTGRES_USER` | `demo` |
| `POSTGRES_DB` | `demo` |
| `POSTGRES_PASSWORD` | 一个单独生成并安全保存的强密码 |

在 **Deployment** 标签页中，使用仅指定镜像的 Captain Definition 部署：

```json
{"schemaVersion":2,"imageName":"postgres:17-alpine"}
```

- 等待 service 正常运行，并通过日志确认数据库已经准备好接受连接。
- 数据库的 `5432` 端口保持私有，无需发布宿主机端口。
- 初始化数据卷后修改 `POSTGRES_PASSWORD`，不会自动修改已存在的数据库用户密码。

## 2. 构建 Web 与 worker 镜像

在新的本地目录中创建 `package.json`：

```json
{"name":"caprover-multi-service-demo","version":"1.0.0","private":true,"type":"module","dependencies":{"pg":"8.11.5"}}
```

创建 `web.mjs`：它使用 PostgreSQL 标准环境变量连接数据库，创建任务，并将一个小文件写入挂载目录：

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

创建 `worker.mjs`，用于从同一数据库处理任务：

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

为两个服务分别创建 Dockerfile：

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

在同一目录中创建两个 Captain Definition 文件：

```json title="captain-definition-web"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.web"}
```

```json title="captain-definition-worker"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.worker"}
```

先在本地运行 `npm install --package-lock-only` 生成 `package-lock.json`，再打包部署文件。由于镜像构建使用 `npm ci`，归档中必须包含 lockfile：

```bash
npm install --package-lock-only
tar -cf deploy.tar package.json package-lock.json web.mjs worker.mjs \
  Dockerfile.web Dockerfile.worker captain-definition-web captain-definition-worker
```

## 3. 创建并部署其他应用

- 创建 `demo-web`，启用 **Has Persistent Data**。
- 添加名为 `demo-uploads` 的数据卷，挂载到 `/data/uploads`；将容器 HTTP 端口设置为 `3000`，并添加下表中的数据库连接变量。
- 创建 `demo-worker`，配置为非 Web 应用，无需数据卷，但使用同一组数据库连接变量：

| 变量 | 两个应用的配置值 |
| --- | --- |
| `PGHOST` | `demo-db` |
| `PGPORT` | `5432` |
| `PGUSER` | `demo` |
| `PGDATABASE` | `demo` |
| `PGPASSWORD` | 与 `demo-db` 配置相同的密码 |

- 新版 CapRover 的内部 Docker service 名称就是应用名称；如果使用旧版应用，可通过 `docker service ls` 确认实际名称。
- 在 `demo-web` 的 **Deployment** 标签页，将 Captain Definition Path 设置为 `./captain-definition-web`，上传 `deploy.tar`。
- Web 应用启动并创建 `jobs` 表后，为 `demo-worker` 设置 Captain Definition Path 为 `./captain-definition-worker`，上传相同的归档文件。
- 查看两个应用的构建日志和 service 日志。
- worker 不需要公开域名或端口映射。

打开 `http://demo-web.<root-domain>/jobs`，预期返回 `[]`。然后为 `demo-web` 启用 HTTPS，验证证书，并在替换示例 hostname 后发送以下请求：

```bash
curl -X POST --data 'first job' https://demo-web.apps.example.com/jobs
curl https://demo-web.apps.example.com/jobs
curl -X PUT --data 'saved upload' https://demo-web.apps.example.com/upload
curl https://demo-web.apps.example.com/upload
```

- 几秒钟后刷新 `/jobs`，确认任务的 `processed: true` 状态。
- 上传文件接口应返回 `saved upload`。
- 重新部署 `demo-web` 并确认上传文件仍在；重启 `demo-db`，确认任务记录未丢失。
- 如果数据丢失，请检查挂载路径和对应 service 所在节点。

## 4. 备份每个数据源

- CapRover 的[配置备份](../server/backup/index.md)不包含 `demo-db-data` 或 `demo-uploads`。
- 需要分别执行 PostgreSQL 逻辑备份和上传数据卷备份，将它们存储在服务器之外，并验证恢复过程。
- 参阅[备份持久化数据](../data-persistence/backup-data.md)。
- 本教程让两个有状态应用运行在单节点上；[本地数据卷不会随着 Swarm 任务自动迁移](../data-persistence/index.md)。
- 生产应用还需要身份验证、上传策略、多 worker 的任务领取机制，以及部署和数据库 Schema 迁移方案。

<span id="source-guides-sample-apps"></span>

## 示例应用

[CapRover 官方示例应用](https://github.com/caprover/caprover/tree/master/captain-sample-apps)提供了多种框架的 Dockerfile 和 Captain Definition 示例。

1. 选择一个示例，检查其 `captain-definition`、Dockerfile、容器 HTTP 端口和所需环境变量。
2. 在 dashboard 中创建测试应用。
3. 选择部署方式：将示例文件打包为 tar，从 **Deployment** 标签页上传，**或者**将示例提交到 Git 分支并通过 [CLI](../deployments/cli.md) 部署。CLI 默认的 Git 模式不会包含未提交或被忽略的文件。
4. 查看 build log。如果容器监听的不是 CapRover 默认端口，应更新应用的容器 HTTP 端口。先通过 HTTP 再通过 HTTPS 验证访问。

示例中的凭据和数据仅用于演示。生产部署前应配置真实 secrets、持久化存储和[备份](../server/backup/index.md)。

旧版文档还收录了社区提供的其他框架示例：

- [CapRover Django 示例](https://gitlab.com/kamneros/caprover-django)
- [Laravel CapRover 模板](https://github.com/jackbrycesmith/laravel-caprover-template)
- [Elixir/Phoenix 示例](https://github.com/TehSnappy/phoenix_sample)

这些第三方示例可能已经停止维护，部署前应检查镜像版本和依赖。

<span id="source-guides-recipes"></span>

## 更多实用指南

常见后续任务可参考：

- [部署已有的 Docker 镜像](../deployments/index.md)，然后设置容器 HTTP 端口并验证公网 URL。
- [让两个应用通过内部网络通信](../domains/firewall.md)，无需公开数据库端口。
- [绑定自定义域名](../domains/index.md)并启用 [HTTPS](../domains/index.md)。
- 写入文件前先[配置持久化目录](../data-persistence/index.md)。
- 检查 session 和存储行为后，再[增加应用副本](../scaling/index.md)。
- [导出并恢复服务器配置](../server/backup/index.md)，同时单独[备份应用数据](../data-persistence/backup-data.md)。

完整案例参阅[Web 应用教程](complete-webapp.md)和[静态网站 / React 应用](static-react.md)。
