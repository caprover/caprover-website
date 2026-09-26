---
id: scale-app
title: Scale an Application
slug: /scaling/scale-app
---

For a stateless app, open its **App Config**, increase **Instance Count**, and save. Docker Swarm starts the requested number of service tasks. Verify the running replicas in the dashboard or with `docker service ls` and exercise the app under representative traffic.

Check that the app can handle concurrent requests and background jobs safely. Replicas can share the same external database, but do not assume local container files are shared. CPU, RAM, database connection limits, and the server's capacity still limit throughput.

For a multi-node cluster, follow [Set Up a Multi-Node Cluster](./multi-node.md) first. A persistent app is normally pinned to one node and one instance; overriding that without compatible storage can corrupt data.
