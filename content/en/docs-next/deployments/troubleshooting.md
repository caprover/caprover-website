---
id: troubleshooting
title: Troubleshooting Deployments
slug: /deployments/troubleshooting
---

Identify the stage that failed: upload or Git fetch, image build or pull, Docker service update, container start, or public HTTP routing. The app's deployment log covers the early stages; the app/service logs and `docker service ps SERVICE_NAME` help after the image is built.

- **Git fetch fails:** Check the repository address, branch, deploy key or limited credentials, and network access from the server.
- **Build fails:** Inspect the first error, Dockerfile and Captain Definition path, and available memory and disk.
- **Image pull fails:** Check image name, tag, registry reachability, and stored credentials. In a cluster, verify each node can pull it.
- **Service is running but HTTP fails:** Confirm DNS, configured container port, app listen address, and NGINX routing. See [Applications troubleshooting](../applications/troubleshooting.md).

Capture relevant logs and the requested image or commit ID. Redact passwords, repository tokens, and deploy webhook URLs before sharing them.
