---
id: public-services
title: Public TCP / UDP Services
slug: /domains/public-services
---

CapRover's NGINX routes HTTP and HTTPS by hostname. Other protocols need an app port mapping in **App Config**: choose a host port, a container port, and `tcp` or `udp`. The backend also supports Docker publish modes `ingress` and `host`.

With `ingress`, Docker Swarm can route a published port across the cluster. With `host`, the port is bound on a node where the task runs; plan placement and avoid collisions between replicas. A mapped port may be reachable wherever your provider or host firewall allows it.

Verify the application listens on the mapped container port. Restrict the host port to the intended clients and use application-level authentication and encryption as needed. For a database example, follow [Connect to Databases Externally](../data-persistence/external-databases.md).
