---
id: contents
title: What Is Backed Up
slug: /server/backup/contents
---

A CapRover backup copies **`/captain/data`** and adds metadata about cluster nodes. This includes CapRover configuration and state, such as app definitions, domain settings, and certificates stored there.

It does **not** automatically include Docker volumes, host bind mounts outside that directory, database contents stored in those locations, uploaded files there, or locally built Docker images. Back up each database using its own consistent export or snapshot process, and copy the persistent directories you actually use. Test that both the CapRover archive and the application data can be restored.

An exception to the image rule is a **self hosted registry**: its stored image data is under `/captain/data/registry`, so that directory is copied and may greatly increase archive size. With an external registry, keep its credentials and image retention policy available for restoration. Without accessible images, redeploy apps after restoring their definitions.

See [Create a Backup](./create.md), [Restore a Server](./restore.md), and [Persistent Directories](../../data-persistence/index.md).
