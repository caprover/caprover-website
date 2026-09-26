---
id: disk-cleanup
title: Disk & Cleanup
slug: /server/disk-cleanup
---

In the dashboard's disk cleanup settings, choose how many **recent deployed versions per app** to retain. CapRover's `DiskCleanupManager` scans Docker images; for each app it protects the deployed version and the preceding `mostRecentLimit` versions when their tags match saved deployment image names. It then attempts to remove images outside that set.

To run cleanup on a schedule, enter a valid **cron expression** and **timezone**. The schedule uses the configured timezone. Clearing the expression disables the scheduled job; the saved retention count resets to 1. A negative retention value is rejected. Confirm that older images are available from a registry or rebuild before removing them; cleanup can affect rollback.

This is **image cleanup**, not database, volume, log, or registry cleanup. Inspect `docker system df` and `docker volume ls` before any manual cleanup. Avoid broad volume pruning: an unused volume can still contain important data for a stopped or broken app. See [What Is Backed Up](./backup/contents.md).
