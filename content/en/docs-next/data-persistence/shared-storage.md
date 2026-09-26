---
id: shared-storage
title: Shared / External Storage
slug: /data-persistence/shared-storage
---

Node-local volumes are the default. To move a stateful task between nodes without copying data, supply storage that every eligible node can mount and that the application can use safely. CapRover does not create or replicate such storage for you.

Possible designs include a supported external Docker volume driver, a managed file service, or keeping the app stateless and moving uploads to an object store. Test failure and reconnection behavior, file permissions, consistency, and whether concurrent writers are safe. A shared mount by itself does not make a database safe to run with multiple replicas.

The older rclone volume recipe relies on a third-party plugin and provider-specific credentials. Its exact setup is deferred pending revalidation against current plugin releases. Keep backups independently of shared storage; availability is not backup.
