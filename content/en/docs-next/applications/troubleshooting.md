---
id: troubleshooting
title: Troubleshooting Applications
slug: /applications/troubleshooting
---

Start with the app's deployment and service logs. If the build failed, use [Troubleshooting Deployments](../deployments/troubleshooting.md). If the build succeeded but the browser shows a 502 error, confirm the container runs, listens on `0.0.0.0`, and matches the configured container HTTP port.

For DNS, HTTPS, redirect, or NGINX issues, use [Domains & Networking troubleshooting](../domains/troubleshooting.md). For a missing file or an app that moved nodes, check [Data & Persistence troubleshooting](../data-persistence/troubleshooting.md). For insufficient replicas, check the app's instance count, node placement, and Docker service state.

Record the app name, the action that failed, relevant logs, and the first observed error before seeking [support](../troubleshooting/support.md). Redact credentials and tokens.
