---
id: diagnostics
title: Diagnostics
slug: /server/diagnostics
---

Start with the failing request or app, its timestamp, and the exact error. In the dashboard, inspect the application's deployment history and logs. On the manager host:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
docker system df
```

For an app, inspect `docker service ps srv-captain--APP_NAME --no-trunc` and `docker service logs srv-captain--APP_NAME --tail 100` after replacing `APP_NAME`. For DNS or HTTPS failures, check records, port reachability, and the domain's certificate status. For multi-node issues, verify node availability and private networking. Remove passwords, tokens, and private data from logs before sharing them. See [Troubleshooting](../troubleshooting/index.md) to find a guide by symptom.
