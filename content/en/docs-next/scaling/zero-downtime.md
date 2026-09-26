---
id: zero-downtime
title: Health Checks and Zero-Downtime Deployments
slug: /scaling/zero-downtime
---

For a stateless app without attached volumes, CapRover asks Docker Swarm to update with **start-first** ordering: start the new task before stopping the old one. An app that takes time to become ready should also define a meaningful Docker `HEALTHCHECK` in its image.

For example, if the image contains `curl` and the app listens on port 3000:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

Use the app's actual readiness endpoint and ensure the check command exists in the image. Deploy to a test app, confirm the new task becomes healthy, and exercise requests throughout a rollout. No configuration guarantees zero interruption if the app, capacity, routing, or database cannot handle both versions concurrently.

For an app with mounted volumes, CapRover selects **stop-first** ordering by default to avoid overlapping writers on local data. Forcing start-first through a service override can corrupt data unless the app and storage support it. See [Service Update Override](../applications/advanced/service-update-override.md).
