---
id: troubleshooting
title: Troubleshooting
slug: /scaling/troubleshooting
---

When a node fails to join, check the default push registry first: CapRover requires one before it calls Docker's join path. Then verify the new server's Docker installation, inactive Swarm state, SSH key/user/port, manager and worker IPs as seen by each other, and trusted inter-node firewall rules.

For tasks stuck pending or restarting, inspect `docker node ls`, `docker service ps SERVICE_NAME`, and relevant service logs. A registry pull failure, placement constraint, insufficient memory, or a missing local volume can appear as an app outage even though the node is healthy.

Review UFW rules on a node after a dashboard join. CapRover issues allow commands during joining; keep provider firewall rules restricted to trusted addresses. For persistent app incidents, preserve the original data and consult [Data & Persistence](../data-persistence/index.md) before moving a task.
