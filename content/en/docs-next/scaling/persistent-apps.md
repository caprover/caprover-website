---
id: persistent-apps
title: Persistent Applications in Clusters
slug: /scaling/persistent-apps
---

CapRover normally limits a persistent app to one instance on a selected node. A Docker named volume using the default local driver and a bind mount both store data on that node; a second node will not automatically see those files.

To move a persistent app, back up and quiesce writes, restore data on the destination, check permissions, update placement, then verify the app with one instance. Keep the old copy until the new instance is proven. A node failure can make a pinned app unavailable until its data is restored elsewhere.

Shared or external storage is an advanced design that must support the application's consistency and concurrent-write requirements. Increasing instance count alone does not provide that storage. See [Shared / External Storage](../data-persistence/shared-storage.md).
