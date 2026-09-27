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

## Collect a full server report

When the dashboard is unavailable, multiple CapRover system services fail, or the commands above do not explain the problem, run the [CapRover diagnostic collector](https://github.com/caprover/caprover-website/blob/master/scripts/caprover-diagnostic.sh) on the **Swarm manager**. It is designed for Debian/Ubuntu hosts with systemd. Download the script, inspect it, then run it as root:

```bash
curl -fL https://raw.githubusercontent.com/caprover/caprover-website/master/scripts/caprover-diagnostic.sh -o caprover-diagnostic.sh
less caprover-diagnostic.sh
sudo sh ./caprover-diagnostic.sh
```

The script saves a report at a `/tmp/caprover-diagnostic.*.txt` path shown at the end of its output. The report is created with owner-only permissions. It checks port owners (80, 443, 3000), common host web servers, local HTTP responses, Docker and Swarm state, task errors, system service specifications and logs, `/captain` mounts and permissions, networks, daemon and kernel errors, package history, firewall rules, and available container runtimes. For runtime testing, it starts and removes temporary `hello-world` and `nginx:1.27.2` containers **only if those images are already present locally**. It does not pull images or change CapRover service configuration.

Read the summary near the end of the report, then use the corresponding detailed sections to verify the cause. A process other than Docker listening on port 80 or 443 may prevent `captain-nginx` from binding the port; a rejected Swarm task includes its own error; a missing `/captain` mount path points to a separate host-path problem. A Docker API warning in the CapRover log does not, on its own, explain every service failure: in [issue #2377](https://github.com/caprover/caprover/issues/2377), host NGINX owned port 80, and stopping that host service restored CapRover. Diagnose your server from its report before applying a recovery step.

The script skips Docker environment variables and CapRover configuration file contents, but process arguments, logs, and package history can still include private data. Review the entire report and remove passwords, deployment tokens, environment secrets, private user data, and identifying host or app details before sharing it publicly. You can share only the sections needed for the symptom. See [Server Diagnostics](../server/diagnostics.md) for targeted checks and recovery procedures.
