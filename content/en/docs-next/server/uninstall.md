---
id: uninstall
title: Uninstall CapRover
slug: /server/uninstall
---

Before removing CapRover, export a [CapRover backup](./backup/create.md) and separate backups for every application's data. Record DNS and image registry dependencies. Removing CapRover or its Docker resources can make applications unavailable.

CapRover does not have a one-command uninstall that safely decides which application data or other Swarm services you want to keep. To retire a **dedicated** CapRover host:

1. Remove or move each app through the dashboard, recording its actual Docker service name and preserving any volumes or bind mounts you need. Confirm no client still depends on its domain or published port.
2. Run `docker service ls` and identify CapRover core services (`captain-captain`, `captain-nginx`, `captain-certbot`, and any optional registry). Remove **only the services you intend to retire** with `docker service rm SERVICE_NAME`. Do not use `docker service rm $(docker service ls -q)` on a shared Swarm; it would remove unrelated applications too.
3. After confirming you have a tested off-host backup, review `/captain` and the output of `docker volume ls`. Remove only the directories and volumes whose data you have explicitly chosen to destroy. A volume can still contain valuable data even if no container is running.
4. Remove DNS records, forwarded ports, and firewall rules no longer needed. Leave the Swarm with `docker swarm leave --force` **only if** this host is being retired from that Swarm and no other service depends on it. Verify from another node first in a cluster.

Keep the backup and registry images until the replacement system has passed its recovery checks. Avoid a blanket `docker system prune --all`: it can remove images needed by other apps or rollbacks.
