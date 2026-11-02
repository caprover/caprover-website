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

See [Server Diagnostics](../server/diagnostics.md) for targeted recovery steps.
