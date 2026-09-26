---
id: node-placement
title: Node Placement
slug: /data-persistence/node-placement
---

CapRover records a node ID for a persistent app and checks that the requested node belongs to the Swarm when settings change. This placement keeps the app near its local volume or bind mount. A new node with the same path name does not have the same files.

Before moving a persistent app, stop writes, back up its data, copy or restore it to the destination node, check permissions and volume names, then change placement and verify the app reads the expected records. Keep a rollback copy until the new placement is proven.

If you want multiple replicas on different nodes, design the storage and application for concurrent access. CapRover does not make node-local storage shared. See [Persistent Applications in Clusters](../scaling/persistent-apps.md).
