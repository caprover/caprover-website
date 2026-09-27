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

For an app, find its service in `docker service ls` and inspect `docker service ps SERVICE_NAME --no-trunc` and `docker service logs SERVICE_NAME --tail 100`. Newer apps generally use the app name; legacy apps may use `srv-captain--APP_NAME`. For DNS or HTTPS failures, check records, port reachability, and the domain's certificate status. For multi-node issues, verify node availability and private networking. Remove passwords, tokens, and private data from logs before sharing them. See [Troubleshooting](../troubleshooting/index.md) to find a guide by symptom.

For an outage involving several system services or an unclear host failure, [collect a full server report](../troubleshooting/diagnostics.md#collect-a-full-server-report) on the manager.

## Dashboard unavailable on port 3000

On the manager, check `docker service ps captain-captain --no-trunc`, then inspect `docker service logs captain-captain --since 60m` and `docker service logs captain-nginx --since 60m`. Run `curl -v http://127.0.0.1:3000/` on the manager. If the local request works but the public IP does not, inspect the provider and host firewalls and the port mapping. If the CapRover service is restarting, use the task error and logs before changing networking. To force a restart after correcting the underlying issue, run `docker service update captain-captain --force`.

## Restart or inspect an app

From the dashboard, save the app's configuration to request a service update. For a shell in a running task, first obtain its physical service name from `docker service ls`, find the host using `docker service ps SERVICE_NAME`, and run these on **that host**:

```bash
docker ps --filter label=com.docker.swarm.service.name=SERVICE_NAME
docker exec -it CONTAINER_ID /bin/sh
```

Replace `SERVICE_NAME` and `CONTAINER_ID` with the values you inspected. Not every image contains `/bin/bash`; `/bin/sh` is more common. A container shell has broad access to the app's data and secrets.
