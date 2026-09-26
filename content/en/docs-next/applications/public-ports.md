---
id: public-ports
title: Public TCP / UDP Ports
slug: /applications/public-ports
---

Use an app port mapping when clients outside CapRover's Docker network need direct TCP or UDP access to a container. Internal app-to-app communication does not require a public mapping.

In the app configuration, add a mapping with a **container port**, a **host port**, and a protocol (`tcp` or `udp`). Choose the publish mode: `ingress` routes through Docker Swarm's routing mesh, while `host` publishes on the node running the task. Host mode requires attention to placement and port conflicts when scaling or moving the app.

Allow the host port through the provider firewall only for the clients that need it. Docker-published ports can bypass ordinary UFW restrictions, so use Docker-aware rules or a provider firewall to limit access. A publicly exposed database must have its own authentication and transport protection. See [Connect to Databases Externally](../data-persistence/external-databases.md) and [Firewall](../domains/firewall.md).
