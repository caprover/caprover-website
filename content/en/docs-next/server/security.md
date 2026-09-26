---
id: security
title: Security & Access
slug: /server/security
---

Change the initial dashboard password, enable HTTPS for the dashboard, and restrict access to ports and SSH using host and provider firewalls. Limit Swarm ports to trusted cluster nodes; see [Multi-Node Setup](../scaling/multi-node.md). Keep Docker and CapRover updated.

Treat deployment tokens, registry credentials, environment variables, backup archives, and SSH keys as secrets. Use separate credentials for automation, rotate them when exposed, and review the [CapRover Pro](./pro.md) two-factor options if your instance uses Pro. A person with Docker socket access on the manager effectively has broad host control; grant shell and dashboard access deliberately.

Back up CapRover configuration and application data separately and practice restoration. For access problems, see [Diagnostics](./diagnostics.md).
