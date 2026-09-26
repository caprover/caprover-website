---
id: persistence
title: Persistence
slug: /fundamentals/persistence
---

Containers are replaceable. Files written only inside a container can disappear when a deployment replaces it. A persistent app keeps selected data outside that container in a Docker volume or a bind mount on a host node.

Persistence affects placement. A node-local volume or bind mount is not automatically shared with other Swarm nodes. If an app moves to another node, it may see an empty path there. Plan backups of persistent data separately from CapRover's own configuration backup.

Start with [Stateless vs Persistent Apps](../data-persistence/stateless-persistent.md) before deploying a database or any app that stores uploads. Use [Node Placement](../data-persistence/node-placement.md) for the cluster implications.
