---
id: netdata
title: Monitoring with NetData
slug: /server/netdata
---

In the dashboard, open **Monitoring** and enable NetData to inspect server CPU, memory, disk, and network activity. Use the displayed monitoring link to open its charts. The server also supports optional NetData alert destinations for SMTP, Slack, Telegram, and Pushbullet. Configure their credentials in the dashboard and send a test alert before relying on them.

Check application logs and [Diagnostics](./diagnostics.md) alongside host metrics. Monitoring does not provide a backup or guarantee that apps remain healthy; configure separate alerts and [backups](./backup/index.md) for production.
