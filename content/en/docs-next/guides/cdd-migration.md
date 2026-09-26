---
id: cdd-migration
title: Migration from CaptainDuckDuck
slug: /guides/cdd-migration
---

CaptainDuckDuck is the predecessor of CapRover. Plan this migration as a maintenance operation: record running services, take a full host snapshot and application-data backups, and keep a rollback path.

The older documentation linked to `dev-scripts/migrate-from-cdd.sh`, but that script is **absent from the current CapRover repository**. Do not run the old one-line migration command against a production server. Preserve the old server or a full snapshot, including `/captain` and application volumes, and provision a separate current CapRover installation. Inventory and redeploy each application on the new server, restore its data separately, then test before moving DNS. A CapRover backup from a modern server is not a documented import format for CaptainDuckDuck state.

Inspect each `captain-definition`: CapRover uses schema version 2, and Dockerfile `COPY` paths may need updating from the historical `./src/` prefix. Configure container HTTP ports through the app settings. Check the dashboard, app routes, persistent data, and HTTPS before ending the maintenance window. For a move to new hardware, also follow [Move CapRover](../server/move-server.md) for the current-server side of the procedure.
