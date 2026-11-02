---
id: app-configuration
title: App Configuration
slug: /reference/app-configuration
---

CapRover stores app settings separately from the Captain Definition. The [app model](https://github.com/caprover/caprover/blob/master/src/models/AppDefinition.ts) includes:

| Area | Saved fields | Purpose |
| --- | --- | --- |
| Identity | `projectId`, `description`, `tags` | Organization and labels. |
| Deployment | `deployedVersion`, `versions`, `captainDefinitionRelativeFilePath` | Version history and definition path. |
| HTTP | `notExposeAsWebApp`, `containerHttpPort`, `forceSsl`, `hasDefaultSubDomainSsl`, `websocketSupport`, `customDomain`, `redirectDomain`, `httpAuth`, `customNginxConfig` | Routing and access. |
| Placement | `hasPersistentData`, `nodeId`, `instanceCount`, `networks` | Persistence and Swarm placement. |
| Runtime | `envVars`, `ports`, `volumes`, `serviceUpdateOverride`, `preDeployFunction` | Environment, published ports, mounts, and service customization. |

- An environment variable is a `{key,value}` pair.
- A published port has `hostPort`, `containerPort`, optional `protocol` (`tcp` or `udp`), and optional `publishMode` (`ingress` or `host`).
- A persistent directory contains `containerPath`, optional `hostPath` or `volumeName`, and optional `mode`.
- Configure these through the dashboard or API instead of hand-editing stored JSON.

## Defaults and Limits {source-reference-defaults-limits}

Selected defaults from [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) and [EnvVars.ts](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts):

| Setting | Default |
| --- | --- |
| CapRover state directory | `/captain`; backed-up data is `/captain/data` |
| Host HTTP, HTTPS, admin ports | `80`, `443`, `3000` |
| Dashboard subdomain | `captain` |
| API version | `v2` |
| Default Docker log size | `512m` |
| Build log lines and app log tail | `50` and `500` respectively |
| Maximum saved deployment versions | `50` |
| Docker build version selector | `2` |
| Scheduled image-cleanup retention when disabled | `1` |

These are source defaults, not guarantees for every installation; values can be overridden and may change by release. Check your instance's version and the matching source before automating against them.

## Legacy Compatibility {source-reference-legacy-compatibility}

- CapRover has historical names and links from its CaptainDuckDuck predecessor.
- Existing `/docs/*` paths remain live during this preview; see the [draft URL map](https://github.com/caprover/caprover-website/blob/master/DOCS_NEXT_URL_MAP.md) for proposed old-to-new destinations.
- Redirects belong to the later cutover review.

- The Captain Definition parser accepts **`schemaVersion: 2`**.
- Older definitions need migration; see [CaptainDuckDuck migration](../guides/cdd-migration.md).
- The app model retains `isLegacyAppName` for apps created before CapRover 1.15.0, which affects service-name compatibility.
- Check [internal networking](../domains/firewall.md#source-domains-internal-networking) before changing hard-coded internal hostnames.

Do not remove existing URLs or legacy service aliases as part of preview publishing. Test each historic link and deployed application at the eventual cutover.
