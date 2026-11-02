---
id: index
title: Scaling & Clusters
slug: /scaling
---

<span id="source-scaling-scale-app"></span>

## Scale an Application

- For a stateless app, open its **App Config**, increase **Instance Count**, and save.
- Docker Swarm starts the requested number of service tasks.
- Verify the running replicas in the dashboard or with `docker service ls` and exercise the app under representative traffic.

- Check that the app can handle concurrent requests and background jobs safely.
- Replicas can share the same external database, but do not assume local container files are shared.
- CPU, RAM, database connection limits, and the server's capacity still limit throughput.

- For a multi-node cluster, follow [Set Up a Multi-Node Cluster](multi-node.md) first.
- A persistent app is normally pinned to one node and one instance; overriding that without compatible storage can corrupt data.

<span id="source-scaling-zero-downtime"></span>

## Health Checks and Zero-Downtime Deployments

- For a stateless app without attached volumes, CapRover asks Docker Swarm to update with **start-first** ordering: start the new task before stopping the old one.
- An app that takes time to become ready should also define a meaningful Docker `HEALTHCHECK` in its image.

For example, if the image contains `curl` and the app listens on port 3000:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

- Use the app's actual readiness endpoint and ensure the check command exists in the image.
- Deploy to a test app, confirm the new task becomes healthy, and exercise requests throughout a rollout.
- No configuration guarantees zero interruption if the app, capacity, routing, or database cannot handle both versions concurrently.

For an app with mounted volumes, CapRover selects **stop-first** ordering by default to avoid overlapping writers on local data. Forcing start-first through a service override can corrupt data unless the app and storage support it. See [Service Update Override](../applications/advanced/index.md#source-applications-advanced-service-update-override).

<span id="source-scaling-placement"></span>

## Application Placement

Docker Swarm schedules stateless app tasks on available nodes according to service constraints and capacity. CapRover stores a node ID for persistent apps to keep them near local storage.

- Inspect `docker service ps SERVICE_NAME` when a replica remains pending or runs on an unexpected host.
- Check node availability, image pull access, resource pressure, and placement constraints.
- For a stateful app, verify the selected node is the one containing its data before editing the node ID.

See [Node Placement](../data-persistence/index.md#source-data-persistence-node-placement) for safe data movement and [Set Up a Multi-Node Cluster](multi-node.md) for first-time setup.

<span id="source-applications-scaling-placement"></span>

## Scaling and Placement

- Set the **Instance Count** in an app's configuration to tell Docker Swarm how many copies of its container to run.
- Start with one, then increase it for a stateless app whose requests and background work can run safely in parallel.
- Verify the replicas and the app's behavior after the change.

- If an app keeps data in a node-local volume or bind mount, placement matters: replicas on another node will not automatically see that data.
- CapRover associates persistent apps with a node ID.
- Review [Node Placement](../data-persistence/index.md#source-data-persistence-node-placement) before changing their node or replica count.

- For a complete scale-out workflow, health checks, and multi-node requirements, use [Scaling & Clusters](index.md).
- Capacity, database connections, and application concurrency limits can become bottlenecks before the requested instance count is useful.
