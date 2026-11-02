---
id: shared-storage
title: Shared / External Storage
slug: /data-persistence/shared-storage
---

- Node-local volumes are the default.
- To move a stateful task between nodes without copying data, supply storage that every eligible node can mount and that the application can use safely.
- CapRover does not create or replicate such storage for you.

- Possible designs include a supported external Docker volume driver, a managed file service, or keeping the app stateless and moving uploads to an object store.
- Test failure and reconnection behavior, file permissions, consistency, and whether concurrent writers are safe.
- A shared mount by itself does not make a database safe to run with multiple replicas.

## Historical rclone volume approach (unverified)

The old documentation included a community example using the `sapk/plugin-rclone` Docker volume plugin to mount S3-compatible remote storage on every Swarm node.

Its essential parts were:

- Configure an rclone remote with `rclone config`, then distribute its `rclone.conf` securely to **each node**.
- Create the remote bucket/path and install the volume plugin on **every node**.
- Provision the Docker volume with `--driver sapk/plugin-rclone`, the remote path, and the application's UID/GID.
- Mount the volume into a stateless CapRover app using **Service Update Override → TaskTemplate.ContainerSpec.Mounts**.

Example of the historical mount override:

```yaml
TaskTemplate:
  ContainerSpec:
    Mounts:
      - Type: volume
        Source: shared-uploads
        Target: /var/www/html/uploads
        ReadOnly: false
```

This is an **archived, untested integration**. Plugin compatibility, cache consistency, and concurrent writes must be validated before use. The [original community recipe](https://github.com/caprover/caprover-website/blob/fd58a91a9b01edb9c0858914dc19493b2d0cc0ac/content/en/docs/stateless-with-persistent-data.md) retains its provider-specific commands for reference. Do not copy its older PHP image version or sample credentials into production.

- The older rclone volume recipe relies on a third-party plugin and provider-specific credentials.
- Its exact setup is deferred pending revalidation against current plugin releases.
- Keep backups independently of shared storage; availability is not backup.
