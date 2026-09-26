---
id: cdd-migration
title: Migration from CaptainDuckDuck
slug: /guides/cdd-migration
---

CaptainDuckDuck is the predecessor of CapRover. Plan this migration as a maintenance operation: record running services, take a full host snapshot and application-data backups, and keep a rollback path.

The historical [migration script](https://github.com/caprover/caprover/blob/master/dev-scripts/migrate-from-cdd.sh) is available in the CapRover source. Read the script and its prerequisites for the version you are migrating; do not execute a downloaded script without review. Verify free space for the script's `/captain` archive, especially if you have a self hosted registry.

After migration, inspect each `captain-definition`: CapRover uses schema version 2, and Dockerfile `COPY` paths may need updating from the historical `./src/` prefix. Configure container HTTP ports through the app settings. Check the dashboard, app routes, persistent data, and HTTPS before ending the maintenance window. For a move to new hardware, also follow [Move CapRover](../server/move-server.md).
