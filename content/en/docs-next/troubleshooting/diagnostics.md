---
id: diagnostics
title: Collect Diagnostics
slug: /troubleshooting/diagnostics
---

Record the time, operation, affected domain or app, expected result, actual result, and error text. Start with the relevant dashboard deployment log or app log.

On the manager node, inspect:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
```

For a specific app, find its service name in `docker service ls`; newer apps use the app name and legacy apps may use `srv-captain--APP_NAME`. Use that name with `docker service ps` or `docker service logs`. For networking failures, capture DNS answers for the dashboard and app domain and test HTTP and HTTPS separately. For storage failures, inspect the volume or bind mount path, free disk, and node placement.

Share relevant log excerpts and reproducible steps only after removing passwords, deployment tokens, environment secrets, and private user data. See [Server Diagnostics](../server/diagnostics.md).
