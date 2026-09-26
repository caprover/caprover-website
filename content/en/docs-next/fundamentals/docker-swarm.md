---
id: docker-swarm
title: Docker Swarm
slug: /fundamentals/docker-swarm
---

Docker Swarm manages services across one or more nodes. CapRover initializes Swarm on a standard fresh installation, even if the server is the only node. A **manager** controls the Swarm; a **worker** runs assigned tasks. Docker tries to keep each service at its requested replica count.

For multiple nodes, Swarm needs management traffic on `2377/tcp`, node discovery on `7946/tcp` and `7946/udp`, and overlay traffic on `4789/udp` between trusted nodes. CapRover also requires a default push registry before adding nodes through its dashboard so built images can be retrieved on other nodes.

Swarm networking is separate from storage: local volumes remain local to their nodes. Read [Set Up a Multi-Node Cluster](../scaling/multi-node.md) before joining a second server.
