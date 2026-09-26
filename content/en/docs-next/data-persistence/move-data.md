---
id: move-data
title: Move Persistent Data
slug: /data-persistence/move-data
---

Moving a persistent app requires moving its data as well as updating its CapRover settings. First identify the actual volume or bind path and the source node. Back it up, then stop writes or put the app into maintenance mode so the copy is consistent.

Create the destination path or volume on the new node, transfer or restore data, and check ownership and permissions for the container user. Update the app's node placement and storage settings only after the destination is ready. Start one instance, verify expected records or files, and keep the source backup until recovery has been tested.

For a database, prefer its supported migration or dump/restore process rather than copying live data files. When moving the whole server, use [Move CapRover to Another Server](../server/move-server.md) for the control-plane steps as well.
