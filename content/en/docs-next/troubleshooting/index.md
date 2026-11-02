---
id: index
title: Troubleshooting
slug: /troubleshooting
---

For a comprehensive host report, use [Collect Diagnostics](diagnostics.md).

<span id="source-applications-troubleshooting"></span>

## App unavailable or HTTP 502

- Check the app's deployment and service logs.
- Confirm the container listens on `0.0.0.0` and that **Container HTTP Port** matches the process.
- Inspect `docker service ps SERVICE_NAME` for task failures.
- For missing data, inspect the configured volume and the node hosting the task.

<span id="source-deployments-troubleshooting"></span>

## Deployment fails

| Failure | Check |
| --- | --- |
| Git fetch | Repository URL, branch, deploy credentials, network access |
| Build | First build error, Dockerfile / `captain-definition`, RAM, disk |
| Image pull | Registry availability, image tag and credentials; every node in a cluster must pull |
| Service update | `docker service ps SERVICE_NAME` and service logs |

<span id="source-domains-troubleshooting"></span>

## DNS, HTTPS and routing

1. **DNS:** Check the hostname's A/AAAA records, wildcard DNS and proxy mode.
2. **Reachability:** Check public `80/tcp` and `443/tcp`, including provider firewalls.
3. **HTTP routing:** Verify the container port, listener and Docker task state.
4. **Certificates:** Check Certbot logs and HTTP-01 reachability.
5. **Redirect loops:** Check Force HTTPS, custom redirects and upstream proxies.

**Domain verification error 1107:** Check that the exact public hostname resolves to this server and is reachable on port 80. For private-only networks, see [Advanced Installation](../installation/advanced/index.md) and its `skipVerifyingDomains` setting. The override does not provide DNS or public TLS certificates.

<span id="source-data-persistence-troubleshooting"></span>

## Storage and databases

- Lost data: Check the container mount path, actual Docker volume or bind-mount path, and task placement.
- Permission errors: Check container UID, read-only flags, directory existence and disk capacity.
- External database connection failures: Verify internal database health, listener/authentication, published host port and firewall.
- Preserve volumes and host paths during investigation. See [Backup Persistent Data](../data-persistence/backup-data.md).

<span id="source-scaling-troubleshooting"></span>

## Swarm and multi-node failures

- **Join fails:** Confirm a default push registry is configured, SSH works, the joining node's Swarm is inactive, and trusted node-to-node ports are reachable.
- **Task pending/restarting:** Inspect `docker node ls`, `docker service ps SERVICE_NAME`, image pull logs, placement constraints and available memory.
- **Persistent task moved:** Data on node-local volumes does not automatically move with the task.
- Review provider firewall restrictions after CapRover modifies UFW rules during node joining.

<span id="source-troubleshooting-support"></span>

## Support

Search [GitHub Discussions](https://github.com/caprover/caprover/discussions) and [issues](https://github.com/caprover/caprover/issues) for the exact error.

<span id="source-troubleshooting-report-bug"></span>

## Report a bug

Use [CapRover issues](https://github.com/caprover/caprover/issues) for product defects, or [website issues](https://github.com/caprover/caprover-website/issues) for documentation defects.

Include version, Docker/OS details, deployment method, reproduction steps, expected/actual behavior, and sanitized logs. Remove all passwords, tokens, private keys and personal data before sharing.
