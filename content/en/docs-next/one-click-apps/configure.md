---
id: configure
title: Configure Installed Services
slug: /one-click-apps/configure
---

A One-Click installation creates ordinary CapRover apps. Open each generated app's configuration to inspect its environment variables, storage, network exposure, domains, and deployment history. Change runtime settings using the app controls, then verify the service starts and retains its data.

Some template variables initialize a service **only on first startup**. For example, changing a database's initial password environment variable later may not change an already-created database user. Follow that product's own password-change procedure, update dependent apps, and test the connection.

Before changing a stateful service, back up its application data. A CapRover configuration backup cannot recover a lost database volume by itself.
