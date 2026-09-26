---
id: troubleshooting
title: Troubleshooting
slug: /data-persistence/troubleshooting
---

If data disappears after deployment, check whether the app wrote to the configured **container path** inside a volume or bind mount. Verify the Docker task is running on the node that holds the data, and inspect the actual volume name or host path there.

If the app cannot write, check container user permissions, directory existence, read-only flags, and free disk space. If an external database client cannot connect, verify the database is healthy internally first, then the host port mapping, publish mode, provider firewall, and database listener/authentication.

Do not delete an app, volume, or host directory while diagnosing missing data. Preserve a copy and use [Back Up Persistent Data](./backup-data.md) before making changes that could overwrite it.
