---
id: multi-node
title: Set Up a Multi-Node Cluster
slug: /scaling/multi-node
---

CapRover runs on Docker Swarm. Its leader hosts the CapRover control service and core components; workers run app tasks. Prepare images, network, and access **before** using the dashboard's add-node action.

## 1. Prepare the additional server

Give the new Ubuntu server a stable IP reachable from the CapRover manager. Install Docker Engine from its official Ubuntu repository on the new server:

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

The last command should report `inactive`; leave this server out of any other Swarm for the dashboard join. Use a worker role for an ordinary additional app host; plan manager roles only if you understand Swarm quorum.

## 2. Configure networking and SSH

Allow `2377/tcp`, `7946/tcp`, `7946/udp`, and `4789/udp` **between trusted Swarm nodes**. Limit overlay and management ports to node addresses in your provider firewall. Keep SSH accessible from the CapRover manager. Check that the manager can reach the new node's SSH port and that both nodes can reach the selected registry.

The dashboard join uses a private SSH key and an SSH user that can run Docker without `sudo` (usually root). Generate a dedicated key, install its public half in that user's `authorized_keys`, and test the connection **from the CapRover manager's network** to the new server before proceeding. For a non-root user, direct Docker access usually requires membership in the `docker` group, which grants root-equivalent host access. Protect the private key; paste it only into CapRover's node-join form.

CapRover runs UFW allow commands on the new node while joining; review the resulting host rules and retain provider-side restrictions to trusted node addresses.

## 3. Configure images before adding the node

Set up a [default push registry](../deployments/registries/default-push.md) reachable by every node. **CapRover rejects add-node requests without one.** Redeploy apps whose images were built before the registry was enabled so their images are pushed there. Verify a newly built app image can be pulled from the additional server. Public or private prebuilt images also require appropriate access from each node.

## 4. Add and verify the node

In **Cluster → Nodes**, provide the manager IP as seen by the new server, the new node IP as seen by CapRover, its SSH host/port/user, the private key, and the chosen worker or manager role. Join the node. Confirm it appears healthy in the dashboard and `docker node ls` on the manager.

Increase the instance count of a **stateless** test app and use `docker service ps SERVICE_NAME` to confirm tasks are scheduled on the intended nodes. Test the app through its domain. If placement does not move as expected, check registry pulls, node availability, and task errors.

## 5. Plan persistent apps separately

A local volume or bind mount stays on its node. CapRover pins persistent apps; a worker joining the cluster does not copy their data. Back up and deliberately migrate data before changing placement. See [Persistent Applications in Clusters](./persistent-apps.md).
