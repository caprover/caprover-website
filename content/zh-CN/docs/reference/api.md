---
id: api
title: HTTP API / caprover-api
slug: /reference/api
---

- CapRover 的 HTTP API 使用 `/api/v2` 版本前缀。
- 登录时发送 `POST /api/v2/login` 请求，JSON body 为 `{"password":"..."}`，并设置 `x-namespace: captain` header。
- 后续用户 API 需要把登录响应的 `data.token` 放到 `x-captain-auth` header，并继续传入 `x-namespace: captain`。
- API 响应包含状态、消息和可选数据。应检查业务状态，而不能仅根据 HTTP 请求成功判断操作成功。

例如，先在 shell 中导出 `CAPROVER_URL` 和 `CAPROVER_PASSWORD`：

```bash
token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/info/" \
  -H 'x-namespace: captain' -H "x-captain-auth: $token"
```

- 使用 HTTPS，避免在日志中输出 token 或密码。
- 主要路由组包括 `/user/apps/`、`/user/projects/`、`/user/oneclick/`、`/user/registries/`、`/user/system/` 和 `/user/pro/`。
- 不同 endpoint 的请求体和响应结构各不相同。具体字段应参考当前部署版本的[服务器路由源码](https://github.com/caprover/caprover/tree/master/src/routes)。

- [caprover-api 客户端](https://github.com/caprover/caprover-api)封装了常用 API 操作。
- 如果 CI 只需要部署单个应用，优先使用应用部署 token。
- 使用未公开文档的响应字段前，先确认目标 CapRover 版本的实现。
- 包含临时下载 token 的调用示例见[自动化备份](../server/backup/index.md)。
