---
id: index
title: Scaling & Availability
slug: /scaling
---

<span id="source-scaling-scale-app"></span>

## Replicas

- **Instance Count** controls the requested number of Swarm service tasks.
- Scale stateless apps whose code and background work support concurrent execution.
- Check CPU, RAM, database connection limits, and task state with `docker service ps SERVICE_NAME`.

<span id="source-scaling-zero-downtime"></span>

## Rolling deployments and health checks

- Stateless apps generally use Docker Swarm **start-first** updates.
- Apps with mounted data use **stop-first** updates by default to prevent simultaneous writers.
- A meaningful health check helps Swarm determine readiness:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

Use an actual readiness endpoint and a command included in your image. Capacity, dependencies and application behavior still determine whether updates are interruption-free.

<span id="source-scaling-placement"></span>

## Placement

- Swarm schedules stateless tasks across available nodes based on constraints and capacity.
- CapRover pins persistent apps to the node hosting local data.
- Check registry access, node availability and placement constraints when tasks stay pending.

<span id="source-applications-scaling-placement"></span>

## Stateful scaling

- Local volumes and bind mounts are not automatically shared between nodes.
- Avoid forcing multiple writers against the same local data. For **start-first** on stateful services, the application and storage must explicitly support it.
- Migrate data before moving a persistent app. See [Persistent Storage](../data-persistence/index.md) and [Multi-Node Setup](multi-node.md).
