---
id: diagnostics
title: Collect Diagnostics
slug: /troubleshooting/diagnostics
---

## Quick checks

Capture: time, operation, affected app/domain, expected result, actual result, and error.

On the **Swarm manager**:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
```

**Check by symptom:**

- **App:** Find its name in `docker service ls`. Older apps may use `srv-captain--APP_NAME`. Use `docker service ps SERVICE_NAME` and `docker service logs SERVICE_NAME`.
- **Networking:** Check DNS and test HTTP and HTTPS separately.
- **Storage:** Check mounts, disk space, and node placement.

## Collect a full server report

Use the [diagnostic collector](https://github.com/caprover/caprover-website/blob/master/scripts/caprover-diagnostic.sh) if the dashboard is unavailable, several services fail, or quick checks are inconclusive. Run on a Debian/Ubuntu **Swarm manager** with systemd:

```bash
curl -fL https://raw.githubusercontent.com/caprover/caprover-website/master/scripts/caprover-diagnostic.sh -o caprover-diagnostic.sh
less caprover-diagnostic.sh
sudo sh ./caprover-diagnostic.sh
```

**Output:** `/tmp/caprover-diagnostic.*.txt`, with owner-only permissions.

**Checks include:**

- Port owners (80/443/3000), host web servers, local HTTP responses
- Docker/Swarm services, task errors, specifications, and logs
- `/captain` mounts and permissions, networks, firewall, kernel and daemon errors
- Package history and available container runtimes

The collector briefly tests local `hello-world` and `nginx:1.27.2` images **if already available**. It does not pull images or change CapRover service configuration.

**Read the report summary first.** Examples:

- **Port 80/443 owned by another process:** CapRover NGINX may fail to bind.
- **Swarm task rejected:** Inspect its task error.
- **`/captain` mount missing:** Inspect the host path and mounts.
- **Docker API warning:** Check other evidence too. In [issue #2377](https://github.com/caprover/caprover/issues/2377), host NGINX occupied port 80.

## Before sharing

- Review the entire report for passwords, tokens, private user data, app names, and identifying host details.
- The collector omits Docker environment variables and CapRover configuration contents, but logs, arguments, and package history can still contain sensitive data.
- Share only relevant, sanitized sections.

See [Server Diagnostics](diagnostics.md) for targeted recovery steps.

<span id="source-server-diagnostics"></span>

## Diagnostics

Start with the failing request or app, its timestamp, and the exact error. In the dashboard, inspect the application's deployment history and logs. On the manager host:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
docker system df
```

- For an app, find its service in `docker service ls` and inspect `docker service ps SERVICE_NAME --no-trunc` and `docker service logs SERVICE_NAME --tail 100`.
- Newer apps generally use the app name; legacy apps may use `srv-captain--APP_NAME`.
- For DNS or HTTPS failures, check records, port reachability, and the domain's certificate status.
- For multi-node issues, verify node availability and private networking.
- Remove passwords, tokens, and private data from logs before sharing them.
- See [Troubleshooting](index.md) to find a guide by symptom.

For an outage involving several system services or an unclear host failure, [collect a full server report](diagnostics.md#collect-a-full-server-report) on the manager.

### Dashboard unavailable on port 3000

- On the manager, check `docker service ps captain-captain --no-trunc`, then inspect `docker service logs captain-captain --since 60m` and `docker service logs captain-nginx --since 60m`.
- Run `curl -v http://127.0.0.1:3000/` on the manager.
- If the local request works but the public IP does not, inspect the provider and host firewalls and the port mapping.
- If the CapRover service is restarting, use the task error and logs before changing networking.
- To force a restart after correcting the underlying issue, run `docker service update captain-captain --force`.

### Restart or inspect an app

- From the dashboard, save the app's configuration to request a service update.
- For a shell in a running task, first obtain its physical service name from `docker service ls`, find the host using `docker service ps SERVICE_NAME`, and run these on **that host**:

```bash
docker ps --filter label=com.docker.swarm.service.name=SERVICE_NAME
docker exec -it CONTAINER_ID /bin/sh
```

Replace `SERVICE_NAME` and `CONTAINER_ID` with the values you inspected. Not every image contains `/bin/bash`; `/bin/sh` is more common. A container shell has broad access to the app's data and secrets.
