---
id: how-caprover-works
title: How CapRover Works
slug: /fundamentals/how-caprover-works
---

- CapRover runs on Docker Swarm.
- The CapRover service stores configuration, the dashboard manages applications, and its NGINX service routes web requests to application services.
- Docker keeps each service at its requested replica count.

- For a web app, the usual request path is: DNS resolves the hostname to your server, CapRover's NGINX accepts the HTTP or HTTPS request, and NGINX forwards it to the app's Docker service and container HTTP port.
- Non-web apps can run without a public HTTP route.

- When you deploy, CapRover builds an image from source or pulls a specified image, then updates the Docker service.
- CapRover's settings describe the app's domains, environment variables, ports, volumes, instance count, and placement.
- The app's own code and data have separate lifecycles; a new image does not automatically back up a database or shared files.

Start with [Getting Started](../get-started.md), then explore [Applications](../applications/index.md), [Deployments](../deployments/index.md), and [Data & Persistence](../data-persistence/index.md).

<span id="source-fundamentals-applications-and-services"></span>

## Applications and Docker Services

- A CapRover **app** is a managed Docker Swarm service.
- Its name identifies the service and normally gives it a default subdomain under your root domain.
- CapRover records the app's settings and deployment history; Docker runs the containers.

- The app's **instance count** tells Swarm how many service tasks to run.
- A web app can receive HTTP traffic through CapRover's NGINX.
- A non-web app can run background jobs or expose a separate TCP/UDP port without an HTTP route.
- An app with node-local persistent data needs placement that keeps it on the node with that data.

- Creating an app and deploying an image are separate steps.
- A newly created app can exist before the intended image is deployed.
- See [Create and Manage Apps](../applications/index.md#source-applications-create-manage) and [Scale an Application](../scaling/index.md#source-scaling-scale-app).

<span id="source-fundamentals-builds-images-deployments"></span>

## Builds, Images, and Deployments

- An **image** packages application code and runtime dependencies.
- CapRover can build an image from a repository or uploaded source, or deploy a prebuilt image from a registry.
- A `captain-definition` file tells CapRover which build or image method to use.

- A **deployment** updates the app's Docker service to run the resulting image.
- A successful upload or build does not guarantee the app serves traffic: it must also listen on the configured container port, become healthy, and have working DNS and routing.
- Build logs and service logs answer different questions.

- CapRover tracks deployed image versions for rollback, but a rollback changes the image rather than reverting environment variables, volume contents, or database migrations.
- In a multi-node setup, a registry accessible by all nodes lets them pull the same image.

Use [Deployments](../deployments/index.md) for the task guides and [Captain Definition Schema](../reference/captain-definition.md) for the exact format.

<span id="source-fundamentals-networking"></span>

## Networking

There are two common routes to an app:

- **Public HTTP(S):** a DNS record points the hostname to the CapRover server.
- CapRover's NGINX matches the hostname and proxies the request to the app's configured container HTTP port.
- HTTPS certificates are issued for the dashboard or app domain after DNS and public port 80 work.

**Internal service traffic:** apps on CapRover's Docker network can reach each other's services by internal service name and container port. This avoids publishing a database port to the internet.

- For protocols that do not use CapRover's HTTP routing, publish a TCP or UDP app port explicitly and allow the corresponding host port in your provider firewall.
- Review the exposure carefully, especially for databases.
- See [Domains & Networking](../domains/index.md) and the complete [port reference](../reference/ports.md).

<span id="source-fundamentals-persistence"></span>

## Persistence

Containers are replaceable. Files written only inside a container can disappear when a deployment replaces it. A persistent app keeps selected data outside that container in a Docker volume or a bind mount on a host node.

Persistence affects placement. A node-local volume or bind mount is not automatically shared with other Swarm nodes. If an app moves to another node, it may see an empty path there. Plan backups of persistent data separately from CapRover's own configuration backup.

Start with [Stateless vs Persistent Apps](../data-persistence/index.md#source-data-persistence-stateless-persistent) before deploying a database or any app that stores uploads. Use [Node Placement](../data-persistence/index.md#source-data-persistence-node-placement) for the cluster implications.

<span id="source-fundamentals-docker-swarm"></span>

## Docker Swarm

- Docker Swarm manages services across one or more nodes.
- CapRover initializes Swarm on a standard fresh installation, even if the server is the only node.
- A **manager** controls the Swarm; a **worker** runs assigned tasks.
- Docker tries to keep each service at its requested replica count.

- For multiple nodes, Swarm needs management traffic on `2377/tcp`, node discovery on `7946/tcp` and `7946/udp`, and overlay traffic on `4789/udp` between trusted nodes.
- CapRover also requires a default push registry before adding nodes through its dashboard so built images can be retrieved on other nodes.

Swarm networking is separate from storage: local volumes remain local to their nodes. Read [Set Up a Multi-Node Cluster](../scaling/multi-node.md) before joining a second server.

<span id="source-reference-glossary"></span>

## Glossary

| Term | Meaning |
| --- | --- |
| App | CapRover's configuration for a deployable Docker service. |
| Captain Definition | The `captain-definition` file selecting an image or build method. |
| Manager node | Docker Swarm manager running CapRover administration. |
| Worker node | Additional Swarm node that can run scheduled services. |
| Root domain | Domain from which CapRover derives dashboard and default app hostnames. |
| Persistent directory | Mount mapped into an app container so data survives container replacement. |
| Default push registry | Docker registry receiving built images so other nodes and restores can retrieve them. |
| One-Click App | Template that deploys and configures one or more CapRover apps. |
| Service | Docker Swarm unit whose tasks run application containers. |

See [Fundamentals](how-caprover-works.md#source-fundamentals-index) for the relationships between these terms.
