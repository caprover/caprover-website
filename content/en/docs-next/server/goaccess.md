---
id: goaccess
title: HTTP Analytics with GoAccess
slug: /server/goaccess
---

GoAccess produces per-app HTTP traffic reports from NGINX access logs. Enable it in the dashboard's monitoring/analytics settings, then open the reports for an app and domain. Set a log-rotation cron schedule and a retention period appropriate for your traffic and disk capacity. CapRover validates the cron expression and stores the retention setting with the GoAccess configuration.

If a report is empty, generate traffic to the selected app, wait for processing, and confirm that the app's access logs exist. The reports are based on HTTP requests that reach CapRover's NGINX; direct TCP/UDP traffic is outside their scope. Handle raw logs and reports as potentially sensitive data. For application errors, use [Diagnostics](./diagnostics.md) and app logs as well.
