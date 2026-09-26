---
id: manage-nodes
title: Manage Nodes
slug: /scaling/manage-nodes
---

Use the **Cluster → Nodes** view and `docker node ls` on a manager to check node availability and role. `docker service ps SERVICE_NAME` shows where an app's tasks run and why a task failed to start.

Before removing or draining a node, identify its running apps and any local volumes or bind mounts. Stateless tasks can usually be rescheduled if images are available from the registry; persistent data does not follow them automatically. Back up and move data deliberately before changing placement.

Keep Swarm management and overlay ports restricted to trusted node addresses. If a node cannot join, verify Docker is installed, its Swarm is inactive, SSH credentials work from the manager, and the registry and inter-node routes are reachable.
