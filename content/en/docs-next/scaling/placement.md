---
id: placement
title: Application Placement
slug: /scaling/placement
---

Docker Swarm schedules stateless app tasks on available nodes according to service constraints and capacity. CapRover stores a node ID for persistent apps to keep them near local storage.

Inspect `docker service ps SERVICE_NAME` when a replica remains pending or runs on an unexpected host. Check node availability, image pull access, resource pressure, and placement constraints. For a stateful app, verify the selected node is the one containing its data before editing the node ID.

See [Node Placement](../data-persistence/node-placement.md) for safe data movement and [Set Up a Multi-Node Cluster](./multi-node.md) for first-time setup.
