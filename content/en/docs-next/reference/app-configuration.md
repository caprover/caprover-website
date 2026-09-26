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

An environment variable is a `{key,value}` pair. A published port has `hostPort`, `containerPort`, optional `protocol` (`tcp` or `udp`), and optional `publishMode` (`ingress` or `host`). A persistent directory contains `containerPath`, optional `hostPath` or `volumeName`, and optional `mode`. Configure these through the dashboard or API instead of hand-editing stored JSON.
