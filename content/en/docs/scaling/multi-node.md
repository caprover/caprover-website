---
id: multi-node
title: Set Up a Multi-Node Cluster
slug: /scaling/multi-node
---

CapRover uses Docker Swarm. The manager runs CapRover's control services; workers run app tasks.

**Before adding a node:** Prepare Docker, private networking, SSH, and a shared registry.

## 1. Prepare server

On the new Ubuntu server, install Docker Engine:

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker version
sudo docker info --format '{{.Swarm.LocalNodeState}}'
```

- Use a stable IP reachable from the manager.
- Docker's Swarm state should be `inactive`.
- Choose **worker** for ordinary app hosts. Manager roles require quorum planning.

## 2. Networking and SSH

**Between trusted nodes only:**

- `2377/tcp`: Swarm management
- `7946/tcp` and `7946/udp`: Node communication
- `4789/udp`: Overlay networking

**SSH:**

1. Use a dedicated private key and a user with Docker access (usually root).
2. Add the public key to the new server's `authorized_keys`.
3. Test SSH **from the manager's network** to the new server.
4. Give CapRover the private key during node setup.

Docker group membership gives root-equivalent access. Keep both SSH and Swarm ports restricted to trusted hosts. Review UFW rules CapRover adds during joining.

## 3. Registry

1. Configure a [default push registry](../deployments/registries/index.md) reachable by **every node**. CapRover requires it before adding nodes.
2. Redeploy apps built before the registry was enabled to push their images.
3. Verify the new node can pull a newly built image. Prebuilt private images also need pull access.

## 4. Add and verify node

1. In **Cluster → Nodes**, enter manager and worker IPs, SSH host/port/user, private key, and node role.
2. Join the node. Verify it appears healthy and check `docker node ls` on the manager.
3. Scale a **stateless** test app and check placement with `docker service ps SERVICE_NAME`.
4. Test the app domain. If placement fails, inspect registry pulls, node health, and task errors.

## 5. Persistent apps

- Local volumes and bind mounts stay on their node.
- CapRover pins persistent apps; joining a node does not copy data.
- Back up and migrate data before changing placement.
- See [Persistent Applications in Clusters](multi-node.md).

<span id="source-scaling-manage-nodes"></span>

## Manage Nodes

Use the **Cluster → Nodes** view and `docker node ls` on a manager to check node availability and role. `docker service ps SERVICE_NAME` shows where an app's tasks run and why a task failed to start.

- Before removing or draining a node, identify its running apps and any local volumes or bind mounts.
- Stateless tasks can usually be rescheduled if images are available from the registry; persistent data does not follow them automatically.
- Back up and move data deliberately before changing placement.

- Keep Swarm management and overlay ports restricted to trusted node addresses.
- If a node cannot join, verify Docker is installed, its Swarm is inactive, SSH credentials work from the manager, and the registry and inter-node routes are reachable.

<span id="source-scaling-persistent-apps"></span>

## Persistent Applications in Clusters

- CapRover normally limits a persistent app to one instance on a selected node.
- A Docker named volume using the default local driver and a bind mount both store data on that node; a second node will not automatically see those files.

- To move a persistent app, back up and quiesce writes, restore data on the destination, check permissions, update placement, then verify the app with one instance.
- Keep the old copy until the new instance is proven.
- A node failure can make a pinned app unavailable until its data is restored elsewhere.

- Shared or external storage is an advanced design that must support the application's consistency and concurrent-write requirements.
- Increasing instance count alone does not provide that storage.
- See [Shared / External Storage](../data-persistence/shared-storage.md).

<span id="source-scaling-networking"></span>

## Multi-Node Networking

- Docker Swarm's overlay network lets services communicate across nodes.
- Between trusted nodes, permit `2377/tcp` for management, `7946/tcp` and `7946/udp` for node communication, and `4789/udp` for overlay traffic.
- Restrict these ports to node addresses; public web traffic still reaches CapRover's HTTP/HTTPS entry point.

- A public app port in `ingress` mode can use the Swarm routing mesh.
- In `host` mode it is published where the task runs, so placement affects which node's address answers.
- For internal database traffic, use the destination app's service name and container port without a public mapping.

If a new node joins but tasks cannot communicate, check inter-node firewalls, Docker service state, and network membership before changing app settings. See the full [port reference](../reference/ports.md).
