---
id: persistent-storage
title: Persistent Storage Recipes
slug: /guides/persistent-storage
---

For an application that writes files, find the exact container directory it uses and mount a persistent directory there before storing real data.

For example, if an image writes uploads to `/app/uploads`, create the app, mark it persistent, add a persistent directory at `/app/uploads`, and deploy the image. Upload a test file, restart the service, and confirm the file remains. A mount at a different path does not protect those files.

For databases, use the image's documented data directory and a database-aware backup/export method. Host bind mounts and Docker volumes usually live on one node; pin the service there or use [shared storage](../data-persistence/shared-storage.md). Back up each volume or database separately from the [CapRover backup](../server/backup/contents.md). See [Volumes](../data-persistence/volumes.md) for the exact storage choices.
