---
id: settings
title: Server Settings
slug: /server/settings
---

Use the dashboard's **Settings** area to manage the root domain, account password, updates, and CapRover backups. Back up the server before changing its domain or upgrading.

## Root domain

Point the wildcard DNS record and dashboard hostname at the server before setting the root domain. Changing it affects generated app and dashboard hostnames; check DNS and renew HTTPS certificates after the change. If you use the self hosted registry, remove or migrate that registry before changing the domain. See [DNS and domains](../domains/index.md).

## Account and recovery

Change the initial password after installation, secure the dashboard with HTTPS, and store recovery credentials safely. Review [Security & Access](./security.md) and [Backup & Restore](./backup/index.md) before production use.
