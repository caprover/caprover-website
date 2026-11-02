---
id: builds-logs
title: Builds and Build Logs
slug: /deployments/builds-logs
---

- CapRover builds source on the server unless you supply a prebuilt image.
- Watch the app's deployment output for the first failing build command.
- A build can fail from missing files, a bad Dockerfile, unavailable dependencies, or insufficient RAM or disk.

- Once the image builds, Docker updates the app service.
- Check the service or app logs separately if the container exits, fails a health check, or returns a 502.
- The configured container HTTP port must match the process's listening port.

- For heavy builds, use CI to build and push the image outside the CapRover server, then deploy that image.
- For a stalled deployment, collect the failing build log, service state, and recent app logs before following [Troubleshooting Deployments](../troubleshooting/index.md).

<span id="source-deployments-versions-rollback"></span>

## Versions and Rollback

- CapRover records image versions for an app.
- From the app's deployment history, choose a previously deployed version to roll back its image.
- Check the result and app health before resuming traffic.

- Rollback does **not** restore earlier environment variables, domains, volume contents, or database schema.
- If the newer version changed persistent data, confirm the older image remains compatible before rolling back.
- Keep enough image history or registry access to retrieve the version you intend to restore.

Health checks and update settings affect how requests behave during a rollout. See [Health Checks and Zero-Downtime Deployments](../scaling/index.md) for availability planning.
