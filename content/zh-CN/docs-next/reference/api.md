---
id: api
title: HTTP API / caprover- api 软件
slug: /reference/api
---

- CapRover 服务版本 HTTP 端点 `/api/v2`.
- 登录方式 `POST /api/v2/login` 和JSON项目 `{"password":"..."}` 加上 `x-namespace: captain` 头曰.
- 使用响应的认证用户路由 `data.token` 作为 `x-captain-auth`,也与 `x-namespace: captain`.
- 响应包包括一个状态,消息,和可选数据;检查状态,而不是将每个HTTP响应都视为一个成功的操作.

例如,导出后 `CAPROVER_URL` 和 `CAPROVER_PASSWORD` 在你的壳里:

```bash
token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/info/" \
  -H 'x-namespace: captain' -H "x-captain-auth: $token"
```

- 使用HTTPS并避免打印令牌或密码.
- 主要路线组为: `/user/apps/`, `/user/projects/`, `/user/oneclick/`, `/user/registries/`, `/user/system/`,以及 `/user/pro/`.
- 其请求机构和答复因终点而异; [服务器路由代码](https://github.com/caprover/caprover/tree/master/src/routes) 是已部署版本的权威目录。

- 这个 [cabrover- api 客户端](https://github.com/caprover/caprover-api) 覆盖共同操作。
- 只部署一个应用程序的 CI 任务优先应用部署符 。
- 在不检查目标 CapRover 版本的情况下,避免依赖于一个没有文件的响应字段 。
- 见 [备份自动化示例](../server/backup/index.md) 对于带有临时下载符的请求序列。
