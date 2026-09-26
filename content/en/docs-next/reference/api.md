---
id: api
title: HTTP API / caprover-api
slug: /reference/api
---

CapRover serves versioned HTTP endpoints under `/api/v2`. Login with `POST /api/v2/login` and JSON `{"password":"..."}` plus the `x-namespace: captain` header. Authenticated user routes use the response's `data.token` as `x-captain-auth`, also with `x-namespace: captain`. The response wrapper includes a status, message, and optional data; check the status instead of treating every HTTP response as a successful operation.

For example, after exporting `CAPROVER_URL` and `CAPROVER_PASSWORD` in your shell:

```bash
token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/info/" \
  -H 'x-namespace: captain' -H "x-captain-auth: $token"
```

Use HTTPS and avoid printing the token or password. The main route groups are `/user/apps/`, `/user/projects/`, `/user/oneclick/`, `/user/registries/`, `/user/system/`, and `/user/pro/`. Their request bodies and responses vary by endpoint; the [server route code](https://github.com/caprover/caprover/tree/master/src/routes) is the authoritative inventory for the deployed version.

The [caprover-api client](https://github.com/caprover/caprover-api) wraps common operations. Prefer app deployment tokens for CI jobs that only deploy one app. Avoid depending on an undocumented response field without checking your target CapRover version. See the [backup automation example](../server/backup/automate.md) for a request sequence with a temporary download token.
