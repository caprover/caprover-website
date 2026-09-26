---
id: existing-swarm
title: Existing Docker Swarm
slug: /installation/advanced/existing-swarm
---

CapRover normally initializes Docker Swarm during installation. The `useExistingSwarm` configuration override lets the installer join an existing initialized Swarm instead. This is advanced: first understand how CapRover's manager, NGINX, registry, and persistent services will be placed on your nodes.

On the intended manager node, confirm that `sudo docker info` reports an active Swarm and that this node can manage it. Ensure the Swarm networking ports are open between trusted nodes: `2377/tcp`, `7946/tcp`, `7946/udp`, and `4789/udp`. Keep overlay traffic private.

Before first installation, write the override in CapRover's persistent directory:

```bash
sudo mkdir -p /captain/data
echo '{"useExistingSwarm":true}' | sudo tee /captain/data/config-override.json
```

Then run the normal installation command from [Getting Started](../../get-started.md) on this manager node. The installer checks for an existing Swarm rather than creating one. Do this on a disposable or carefully planned cluster first: CapRover creates and manages services and networks in that Swarm, and its persistent state remains under `/captain` on the CapRover node.

For app scheduling beyond one node, a default push registry is required before adding nodes through CapRover. Read [Set Up a Multi-Node Cluster](../../scaling/multi-node.md) before deploying applications across nodes.
