---
id: builds-logs
title: Builds and Build Logs
slug: /deployments/builds-logs
---

CapRover builds source on the server unless you supply a prebuilt image. Watch the app's deployment output for the first failing build command. A build can fail from missing files, a bad Dockerfile, unavailable dependencies, or insufficient RAM or disk.

Once the image builds, Docker updates the app service. Check the service or app logs separately if the container exits, fails a health check, or returns a 502. The configured container HTTP port must match the process's listening port.

For heavy builds, use CI to build and push the image outside the CapRover server, then deploy that image. For a stalled deployment, collect the failing build log, service state, and recent app logs before following [Troubleshooting Deployments](./troubleshooting.md).
