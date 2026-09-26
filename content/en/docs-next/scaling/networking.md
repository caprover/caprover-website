---
id: networking
title: Multi-Node Networking
slug: /scaling/networking
---

Docker Swarm's overlay network lets services communicate across nodes. Between trusted nodes, permit `2377/tcp` for management, `7946/tcp` and `7946/udp` for node communication, and `4789/udp` for overlay traffic. Restrict these ports to node addresses; public web traffic still reaches CapRover's HTTP/HTTPS entry point.

A public app port in `ingress` mode can use the Swarm routing mesh. In `host` mode it is published where the task runs, so placement affects which node's address answers. For internal database traffic, use the destination app's service name and container port without a public mapping.

If a new node joins but tasks cannot communicate, check inter-node firewalls, Docker service state, and network membership before changing app settings. See the full [port reference](../reference/ports.md).
