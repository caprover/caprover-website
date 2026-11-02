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

1. Configure a [default push registry](../deployments/registries/default-push.md) reachable by **every node**. CapRover requires it before adding nodes.
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
- See [Persistent Applications in Clusters](./persistent-apps.md).
