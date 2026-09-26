---
id: bind-mounts
title: Bind Mounts
slug: /data-persistence/bind-mounts
---

A bind mount maps a specific host directory into a container. Create the host directory on the node that will run the app, set its ownership and permissions for the container process, then enter the host path and container path in the app's persistent-directory settings.

For example, host `/srv/app/uploads` mapped to container `/app/uploads` lets the app keep uploaded files when its container is replaced. Check that the host path exists before deployment. Use an absolute host path, and avoid mounting sensitive host directories into an untrusted app.

The path is node-local. If a task is scheduled on another server, an identical path there is not automatically the same data. Keep the app pinned to its data node or provide tested shared storage. Back up the host directory independently of CapRover configuration.
