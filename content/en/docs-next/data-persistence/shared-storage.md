---
id: shared-storage
title: Shared / External Storage
slug: /data-persistence/shared-storage
---

- Docker volumes are local to a node by default.
- For cross-node access, use shared storage mounted on every eligible node, or store uploads externally.
- CapRover does not provision or replicate shared storage.
- Validate permissions, failure recovery, and concurrent-write behavior. A shared volume alone does not make a database safe for multiple replicas.
- Back up shared data separately.
