---
id: complete-webapp
title: 完成Web 应用教程
slug: /guides/complete-webapp
---

- 这个例子结合了一个公共节点Web 应用,一个私人workerPostgreSQL,和一个持久的上传目录.
- Web 应用接受一个简单任务;worker在PostgreSQL中对其进行了标签.
- **端点没有认证,为一次性学习环境.** 使用一个具有足够的内存的单节点服务器PostgreSQL和两个节点服务;一个1GB主机可能太小,无法同时构建镜像.

## 1. 建立私人数据库

- 完成 [开始](../get-started.md),包括通配符DNS和dashboardHTTPS.
- 创建名为 CapRover 的应用程序 `demo-db` 与 **Has Persistent Data** 启用和 **Do not expose as web app** 选中 。
- 添加一个命名卷 `demo-db-data` 时间 `/var/lib/postgresql/data`,用于 PostgreSQL 17 镜像的数据路径。
- 在第一次部署前设定这些应用环境变量 :

| 变量 | 数值 |
| --- | --- |
| `POSTGRES_USER` | `demo` |
| `POSTGRES_DB` | `demo` |
| `POSTGRES_PASSWORD` | 您安全保存的唯一的强密码 |

在那个 **部署** 选项卡,部署此镜像唯一的队长定义 :

```json
{"schemaVersion":2,"imageName":"postgres:17-alpine"}
```

- 等待它的服务运行,它的日志说它已经准备好连接了.
- 保留数据库端口 `5432` 私人;不需要发布host 端口.
- 变化 `POSTGRES_PASSWORD` 在音量初始化后,不会更改现有的数据库用户密码.

## 2. 建立网络和worker 镜像

在新的本地目录中创建 `package.json`:

```json
{"name":"caprover-multi-service-demo","version":"1.0.0","private":true,"type":"module","dependencies":{"pg":"8.11.5"}}
```

创建 `web.mjs`。它使用标准 PostgreSQL 环境变量,向数据库写一个任务,并在挂载路径上存储一个小上传:

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

创建 `worker.mjs` 从同一数据库处理工作:

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

创建这两个 Docker 文件 :

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

在同一目录中创建两个“队长定义”文件 :

```json title="captain-definition-web"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.web"}
```

```json title="captain-definition-worker"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.worker"}
```

运行 `npm install --package-lock-only` 本地创建 `package-lock.json`,然后包装文件。 构建用途 `npm ci`,所以在归档中包含锁文件 :

```bash
npm install --package-lock-only
tar -cf deploy.tar package.json package-lock.json web.mjs worker.mjs \
  Dockerfile.web Dockerfile.worker captain-definition-web captain-definition-worker
```

## 3. 创建、配置和部署其他应用程序

- 创建 `demo-web` 与 **Has Persistent Data** 已启用。
- 添加一个命名卷 `demo-uploads` 时间 `/data/uploads`,将容器 HTTP 端口设置为 `3000`,并给出下面的数据库变量。
- 创建 `demo-worker` 作为无音量和相同数据库变量的非Web 应用:

| 变量 | 两个应用程序的值 |
| --- | --- |
| `PGHOST` | `demo-db` |
| `PGPORT` | `5432` |
| `PGUSER` | `demo` |
| `PGDATABASE` | `demo` |
| `PGPASSWORD` | 相同的密码集 `demo-db` |

- 新的 CapRover apps 将自己的应用名称作为内部 Docker 服务名称; 用 `docker service ls` 如果你正在使用一个遗留的应用程序。
- 内 `demo-web`'s **部署** 选项卡,设置队长定义路径到 `./captain-definition-web` 上传 `deploy.tar`.
- Web 应用启动并创建后 `jobs` 表格,设置 `demo-worker`Captain Definition路径 `./captain-definition-worker` 并上传同一档案。
- 检查两个应用程序的构建和服务日志.
- worker不需要公网域名或端口映射。

访问 `http://demo-web.<root-domain>/jobs` 和预期 `[]`。然后启用 HTTPS 用于 `demo-web`,验证其证书,并提出这些请求,替换示例主机名:

```bash
curl -X POST --data 'first job' https://demo-web.apps.example.com/jobs
curl https://demo-web.apps.example.com/jobs
curl -X PUT --data 'saved upload' https://demo-web.apps.example.com/upload
curl https://demo-web.apps.example.com/upload
```

- 刷新 `/jobs` 几秒钟后,检查工作是否 `processed: true`.
- 上传应该说 `saved upload`.
- 调动 `demo-web` 并验证上传遗迹; 重新启动 `demo-db` 并证实这份工作仍在名单上。
- 如果其中之一消失, 请检查所配置的挂载路径和托管该服务的节点 。

## 4. 备份每个数据源

- 卡普罗弗 [配置备份](../server/backup/index.md) 不包含 `demo-db-data` 或 `demo-uploads`.
- 设置 PostgreSQL 逻辑备份和上传音量的单独副本,将两者都存储在主机外,并测试恢复.
- 见 [备份持久化数据](../data-persistence/backup-data.md).
- 这个教程在单个节点上保持两个状态的应用程序; [本地卷不随 Swararm 任务移动](../data-persistence/index.md).
- 生产应用程序还需要认证、上传政策、为多个worker申请工作以及部署和数据库迁移战略。

<span id="source-guides-sample-apps"></span>

## 示例应用

这个 [CapRover 样本应用](https://github.com/caprover/caprover/tree/master/captain-sample-apps) 为多个框架演示 Dockerfiles 和 Captain 定义 。

1. 选个样本检查一下 `captain-definition`, Dockerfile, 曝光的容器端口, 以及所需的环境变量 。
2. 在dashboard中创建一次性应用.
3. 选择一种部署方法: 将样本的部署文件包成一个 tar 归档, 从应用程序上传 **部署** 选项卡, **或** 将样本输入一个 Git 分支, 并将其与 [国 际](../deployments/cli.md)。 CLI 的普通 Git 模式排除未承诺和忽略的文件。
4. 观察积木. 如果容器在CapRover默认值以外的一个端口上收听,则将应用的容器HTTP端口相应设置. 在 HTTP 上检查应用程序 URL, 然后是 HTTPS 。

仅将抽样证书和抽样数据作为例子。 在生产使用之前,确定真正的秘密,必要时增加持久化,并计划 [备份](../server/backup/index.md).

遗留文献中的其他社区框架实例:

- [CapRover Django 实例](https://gitlab.com/kamneros/caprover-django)
- [Laravel CapRover 模板](https://github.com/jackbrycesmith/laravel-caprover-template)
- [Elixir/Phoenix样本](https://github.com/TehSnappy/phoenix_sample)

这些第三方实例可能无法保存。 在部署前审查其镜像版本和依赖性 。

<span id="source-guides-recipes"></span>

## 其他示例方案

利用这些有重点的办法执行共同的后续行动任务:

- [部署已有的 Docker 镜像](../deployments/index.md),然后设置容器 HTTP 端口并验证公共 URL。
- [私下连接两个应用程序](../domains/firewall.md) 不发布数据库端口。
- [附加自定义域](../domains/index.md) 并启用 [HTTPS](../domains/index.md).
- [添加持久化目录](../data-persistence/index.md) 在撰写文件之前。
- [缩放应用程序](../scaling/index.md) 在检查会话和存储行为后。
- [导出并恢复服务器配置](../server/backup/index.md) 与单独的 [数据备份](../data-persistence/backup-data.md).

完整的示例见 [完成 Web 应用程序](complete-webapp.md) 和 [静态 / 反应 App](static-react.md).
