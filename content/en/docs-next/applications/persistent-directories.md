---
id: persistent-directories
title: Persistent Directories
slug: /applications/persistent-directories
---

Persistent directories store selected container paths outside the replaceable app container. In the app configuration, add a Docker volume or bind mount and identify the **container path** your app actually writes to. Save the settings and verify the app can read and write the mounted location.

Choose persistence when creating the app if it is stateful. On a multi-node cluster, a local volume or bind mount stays on its host; keep the app on the node that holds its data. Back up the mounted data separately from a CapRover configuration backup.

See [Docker Volumes](../data-persistence/volumes.md), [Bind Mounts](../data-persistence/bind-mounts.md), and [Back Up Persistent Data](../data-persistence/backup-data.md) for storage and recovery workflows.
