---
id: glossary
title: Glossary
slug: /reference/glossary
---

| Term | Meaning |
| --- | --- |
| App | CapRover's configuration for a deployable Docker service. |
| Captain Definition | The `captain-definition` file selecting an image or build method. |
| Manager node | Docker Swarm manager running CapRover administration. |
| Worker node | Additional Swarm node that can run scheduled services. |
| Root domain | Domain from which CapRover derives dashboard and default app hostnames. |
| Persistent directory | Mount mapped into an app container so data survives container replacement. |
| Default push registry | Docker registry receiving built images so other nodes and restores can retrieve them. |
| One-Click App | Template that deploys and configures one or more CapRover apps. |
| Service | Docker Swarm unit whose tasks run application containers. |

See [Fundamentals](../fundamentals/index.md) for the relationships between these terms.
