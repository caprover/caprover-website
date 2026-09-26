---
id: stateless-persistent
title: Stateless vs Persistent Apps
slug: /data-persistence/stateless-persistent
---

A stateless app can be replaced or moved without losing required local data. A persistent app stores important files in a Docker volume or host bind mount. Choose **Has Persistent Data** when creating a database or an app that stores uploads locally, then explicitly configure every directory that must survive a new container.

Persistence is per mounted path: turning on the persistent-app setting alone does not preserve arbitrary files inside the container. CapRover normally keeps a persistent app on a specific node and at one instance. The dashboard permits advanced overrides, but multiple replicas using the same local data can corrupt it unless the app and storage are designed for concurrent access.

A web app that stores its uploads in an external object store and its records in a separate database can remain stateless. Back up the database and object store separately. See [Docker Volumes](./volumes.md), [Bind Mounts](./bind-mounts.md), and [Node Placement](./node-placement.md).
