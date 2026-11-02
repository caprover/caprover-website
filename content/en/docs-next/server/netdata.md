---
id: netdata
title: Monitoring with NetData
slug: /server/netdata
---

- In the dashboard, open **Monitoring** and enable NetData to inspect server CPU, memory, disk, and network activity.
- Use the displayed monitoring link to open its charts.
- The server also supports optional NetData alert destinations for SMTP, Slack, Telegram, and Pushbullet.
- Configure their credentials in the dashboard and verify that an alert notification reaches the destination before relying on it.

Check application logs and [Diagnostics](../troubleshooting/diagnostics.md) alongside host metrics. Monitoring does not provide a backup or guarantee that apps remain healthy; configure separate alerts and [backups](backup/index.md) for production.

<span id="source-server-goaccess"></span>

## HTTP Analytics with GoAccess

- GoAccess produces per-app HTTP traffic reports from NGINX access logs.
- Enable it in the dashboard's monitoring/analytics settings, then open the reports for an app and domain.
- Set a log-rotation cron schedule and a retention period appropriate for your traffic and disk capacity.
- CapRover validates the cron expression and stores the retention setting with the GoAccess configuration.

- If a report is empty, generate traffic to the selected app, wait for processing, and confirm that the app's access logs exist.
- The reports are based on HTTP requests that reach CapRover's NGINX; direct TCP/UDP traffic is outside their scope.
- Handle raw logs and reports as potentially sensitive data.
- For application errors, use [Diagnostics](../troubleshooting/diagnostics.md) and app logs as well.
