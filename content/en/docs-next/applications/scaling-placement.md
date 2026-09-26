---
id: scaling-placement
title: Scaling and Placement
slug: /applications/scaling-placement
---

Set the **Instance Count** in an app's configuration to tell Docker Swarm how many copies of its container to run. Start with one, then increase it for a stateless app whose requests and background work can run safely in parallel. Verify the replicas and the app's behavior after the change.

If an app keeps data in a node-local volume or bind mount, placement matters: replicas on another node will not automatically see that data. CapRover associates persistent apps with a node ID. Review [Node Placement](../data-persistence/node-placement.md) before changing their node or replica count.

For a complete scale-out workflow, health checks, and multi-node requirements, use [Scaling & Clusters](../scaling/index.md). Capacity, database connections, and application concurrency limits can become bottlenecks before the requested instance count is useful.
