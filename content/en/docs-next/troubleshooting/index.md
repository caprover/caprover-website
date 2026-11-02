---
id: index
title: Troubleshooting
slug: /troubleshooting
---

Choose the area that matches the failure:

| Symptom | Start here |
| --- | --- |
| Installation or dashboard setup | [Installation](../installation/index.md) and [Getting Started](../get-started.md) |
| Build, image, or deployment | [Deployments troubleshooting](index.md) |
| App settings or availability | [Applications troubleshooting](index.md) |
| DNS, HTTPS, 502, or domain | [Domains troubleshooting](index.md) |
| Volumes or lost data | [Data troubleshooting](index.md) |
| Cluster or node placement | [Scaling troubleshooting](index.md) |
| One-Click installation | [One-Click troubleshooting](../one-click-apps/index.md) |
| Upgrade, backup, cleanup, or host | [Server diagnostics](diagnostics.md) |

To ask for help, [collect diagnostics](diagnostics.md), [find support](index.md), or [report a bug](index.md).

<span id="source-troubleshooting-support"></span>

## Get Support

First choose the [troubleshooting route](index.md) that matches your symptom, then collect [diagnostics](diagnostics.md). Search existing [CapRover discussions](https://github.com/caprover/caprover/discussions) and [issues](https://github.com/caprover/caprover/issues) for the exact error.

- For configuration advice, ask in GitHub Discussions with the CapRover and Docker versions, relevant sanitized logs, deployment method, and steps tried.
- For a reproducible product defect, [report a bug](index.md).
- Do not publish secrets, private SSH keys, or an unredacted backup.

<span id="source-troubleshooting-report-bug"></span>

## Report a Bug

Check existing [issues](https://github.com/caprover/caprover/issues) first. When opening a new issue, include:

- CapRover version, Docker version, host OS, and whether this is a single server or cluster.
- The affected page, feature, or API request and the exact steps to reproduce it.
- Expected versus actual behavior, the time of failure, and sanitized error or service logs.
- Whether the problem occurs with a minimal test app and which changes preceded it.

Use [CapRover issues](https://github.com/caprover/caprover/issues) for product defects and [website issues](https://github.com/caprover/caprover-website/issues) for documentation defects. Never attach a raw backup, password, token, or private data.

<span id="source-applications-troubleshooting"></span>

## Troubleshooting Applications

- Start with the app's deployment and service logs.
- If the build failed, use [Troubleshooting Deployments](index.md).
- If the build succeeded but the browser shows a 502 error, confirm the container runs, listens on `0.0.0.0`, and matches the configured container HTTP port.

- For DNS, HTTPS, redirect, or NGINX issues, use [Domains & Networking troubleshooting](index.md).
- For a missing file or an app that moved nodes, check [Data & Persistence troubleshooting](index.md).
- For insufficient replicas, check the app's instance count, node placement, and Docker service state.

Record the app name, the action that failed, relevant logs, and the first observed error before seeking [support](index.md). Redact credentials and tokens.

<span id="source-deployments-troubleshooting"></span>

## Troubleshooting Deployments

- Identify the stage that failed: upload or Git fetch, image build or pull, Docker service update, container start, or public HTTP routing.
- The app's deployment log covers the early stages; the app/service logs and `docker service ps SERVICE_NAME` help after the image is built.

- **Git fetch fails:** Check the repository address, branch, deploy key or limited credentials, and network access from the server.
- **Build fails:** Inspect the first error, Dockerfile and Captain Definition path, and available memory and disk.
- **Image pull fails:** Check image name, tag, registry reachability, and stored credentials. In a cluster, verify each node can pull it.
- **Service is running but HTTP fails:** Confirm DNS, configured container port, app listen address, and NGINX routing. See [Applications troubleshooting](index.md).

Capture relevant logs and the requested image or commit ID. Redact passwords, repository tokens, and deploy webhook URLs before sharing them.

<span id="source-domains-troubleshooting"></span>

## Troubleshooting

Check the request path in order:

1. **DNS:** Does the exact hostname resolve to the intended server IP? Check wildcard and custom records, and any stale AAAA record.
2. **Firewall:** Do public ports 80 and 443 reach CapRover? Is a provider firewall or proxy intercepting them?
3. **HTTP routing:** Does plain HTTP select the correct app? If it returns 502, check the container HTTP port, app listen address, and Docker task state.
4. **Certificate:** Did HTTPS get enabled for this exact hostname? Check the Certbot logs and HTTP challenge reachability before retrying.
5. **Redirects:** After HTTPS works, test Force HTTPS and any redirect-domain or reverse-proxy rule for loops.

Record the failing hostname, DNS answer, HTTP response, and relevant service logs. Remove tokens and passwords before sharing diagnostics. See [Firewall](../domains/firewall.md) and [HTTPS](../domains/index.md) for the setup prerequisites.

- If CapRover reports **domain verification error 1107**, first confirm that the exact domain resolves directly to this server and is reachable on port 80 from outside your network.
- A DNS proxy or incorrect AAAA record can make CapRover's view differ from yours.
- For a private network where a public DNS verification cannot work, see [Local / Private Network](../installation/advanced/index.md); its `skipVerifyingDomains` override disables CapRover's check but does not make DNS or public certificate issuance work.
- Do not enable that override to conceal a broken public DNS configuration.

<span id="source-data-persistence-troubleshooting"></span>

## Troubleshooting

- If data disappears after deployment, check whether the app wrote to the configured **container path** inside a volume or bind mount.
- Verify the Docker task is running on the node that holds the data, and inspect the actual volume name or host path there.

- If the app cannot write, check container user permissions, directory existence, read-only flags, and free disk space.
- If an external database client cannot connect, verify the database is healthy internally first, then the host port mapping, publish mode, provider firewall, and database listener/authentication.

Do not delete an app, volume, or host directory while diagnosing missing data. Preserve a copy and use [Back Up Persistent Data](../data-persistence/backup-data.md) before making changes that could overwrite it.

<span id="source-scaling-troubleshooting"></span>

## Troubleshooting

- When a node fails to join, check the default push registry first: CapRover requires one before it calls Docker's join path.
- Then verify the new server's Docker installation, inactive Swarm state, SSH key/user/port, manager and worker IPs as seen by each other, and trusted inter-node firewall rules.

- For tasks stuck pending or restarting, inspect `docker node ls`, `docker service ps SERVICE_NAME`, and relevant service logs.
- A registry pull failure, placement constraint, insufficient memory, or a missing local volume can appear as an app outage even though the node is healthy.

- Review UFW rules on a node after a dashboard join.
- CapRover issues allow commands during joining; keep provider firewall rules restricted to trusted addresses.
- For persistent app incidents, preserve the original data and consult [Data & Persistence](../data-persistence/index.md) before moving a task.
