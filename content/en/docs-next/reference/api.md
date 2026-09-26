---
id: api
title: HTTP API / caprover-api
slug: /reference/api
---

CapRover serves versioned HTTP endpoints under `/api/v2`. For example, the login request uses `POST /api/v2/login` with JSON `{"password":"..."}` and the `x-namespace: captain` header. Authenticated user routes use the response's `data.token` as `x-captain-auth`, plus `x-namespace: captain`.

The [server route code](https://github.com/caprover/caprover/tree/master/src/routes) is the authoritative endpoint inventory. The [caprover-api client](https://github.com/caprover/caprover-api) wraps common operations. Avoid depending on an undocumented response field without checking your target CapRover version. Always use HTTPS for credentials and deployment tokens. See the [backup automation example](../server/backup/automate.md) for an authenticated request sequence.
