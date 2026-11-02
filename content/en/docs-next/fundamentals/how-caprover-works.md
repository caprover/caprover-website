---
id: how-caprover-works
title: How CapRover Works
slug: /fundamentals/how-caprover-works
---

CapRover manages Docker Swarm services on one or more servers.

- **CapRover:** Stores app configuration, domains, deployment history and settings.
- **Docker Swarm:** Starts containers, updates service images and maintains requested replicas.
- **NGINX:** Routes HTTP(S) traffic by hostname to an app's container port.
- **Docker registry:** Distributes images to nodes in a cluster.
- **Volumes and bind mounts:** Preserve application data outside replaceable containers.

<span id="source-fundamentals-applications-and-services"></span>

## Applications and services

A CapRover app maps to a Docker Swarm service.

- A web app normally gets `<app-name>.<root-domain>`.
- Workers and databases can run without public HTTP routing.
- Stateful apps using local storage must stay on the node holding that data.

<span id="source-fundamentals-builds-images-deployments"></span>

## Builds and deployments

- Deploy an existing image or build one using `captain-definition`.
- Deployment updates the Docker service to run that image.
- A successful image build does **not** guarantee a healthy app. The process must listen on the configured container port.
- Image rollbacks do not restore environment variables, database schema or volume contents.

See [Deployments](../deployments/index.md) and [Captain Definition](../reference/captain-definition.md).

<span id="source-fundamentals-networking"></span>

## Networking

- **Public web traffic:** DNS → CapRover NGINX → app's HTTP port.
- **Internal traffic:** Swarm service name and internal port, such as `postgres:5432`, without publishing a database port.
- **Other protocols:** Publish TCP/UDP ports explicitly. See [Port Reference](../reference/ports.md).

<span id="source-fundamentals-persistence"></span>

## Persistence

- Data written only inside a container can disappear on redeployment.
- Docker volumes and bind mounts are generally **node-local**. Swarm does not replicate their data.
- Back up app data separately from CapRover's own configuration.

See [Persistent Storage](../data-persistence/index.md).

<span id="source-fundamentals-docker-swarm"></span>

## Docker Swarm

- CapRover initializes a Swarm even for a single-node installation.
- **Managers** control the Swarm; **workers** execute assigned tasks.
- Multi-node setups require trusted inter-node networking and a reachable default push registry. See [Multi-Node Setup](../scaling/multi-node.md).

<span id="source-reference-glossary"></span>

## Terms

| Term | Meaning |
| --- | --- |
| `captain-definition` | Build or image selection file |
| Root domain | DNS suffix used by the dashboard and default app domains |
| Instance | A replica of a Docker service |
| Persistent directory | Docker volume or bind mount inside an app |
| One-Click App | Template deploying one or more CapRover apps |
