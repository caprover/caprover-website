---
id: versions-rollback
title: Versions and Rollback
slug: /deployments/versions-rollback
---

CapRover records image versions for an app. From the app's deployment history, choose a previously deployed version to roll back its image. Check the result and app health before resuming traffic.

Rollback does **not** restore earlier environment variables, domains, volume contents, or database schema. If the newer version changed persistent data, confirm the older image remains compatible before rolling back. Keep enough image history or registry access to retrieve the version you intend to restore.

Health checks and update settings affect how requests behave during a rollout. See [Health Checks and Zero-Downtime Deployments](../scaling/zero-downtime.md) for availability planning.
