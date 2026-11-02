---
id: index
title: Advanced Installation
slug: /installation/advanced
---

<span id="source-installation-local-private-network"></span>

## Local / Private Network

- Run CapRover on a machine with a private IP for local testing or a home server.
- First decide whether it will be reachable only on your LAN or from the public internet.
- A private-only hostname cannot receive a public Let's Encrypt certificate through the usual HTTP challenge.

### Prepare the machine

- Install Docker Engine and verify it with `sudo docker version`.
- Give the machine a stable LAN address.
- In this example it is `192.168.1.12`.
- Before installation, create `/captain/data/config-override.json` to skip the public DNS verification that is unsuitable for a private domain:

```bash
sudo mkdir -p /captain/data
echo '{"skipVerifyingDomains":true}' | sudo tee /captain/data/config-override.json
sudo docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 \
  -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

Use the machine's actual LAN IP in `MAIN_NODE_IP_ADDRESS`. From another LAN device, open `http://192.168.1.12:3000` and change the initial password. Allow these ports through the machine's firewall for your intended clients.

### Private-only domain

- Configure a local DNS server to point `*.apps.home.example` to `192.168.1.12`, and set the CapRover root domain to `apps.home.example` in the dashboard.
- If your DNS server cannot create wildcard records, add `captain.apps.home.example` and each app subdomain individually.
- The hosts file on one computer does not provide wildcard DNS to other devices.
- Check name resolution from a client before creating an app.

Use HTTP on this private-only name. Do not enable CapRover's public Let's Encrypt flow for a domain that cannot resolve and be reached from the public internet.

### Public access through the router

- For a public domain and HTTPS, point the wildcard public DNS A record to your router's public IPv4 address.
- Forward router port `80/tcp` to `192.168.1.12:80` and `443/tcp` to `192.168.1.12:443`.
- Forward `443/udp` if you want HTTP/3.
- The server must keep a stable LAN IP, and inbound connections must reach the router; carrier-grade NAT can prevent this setup.

- Set the public root domain in CapRover, verify `captain.<root-domain>` resolves and reaches the server over HTTP, then enable dashboard and app HTTPS as described in [Getting Started](../../get-started.md).
- Keep the admin port `3000` restricted to your LAN or another trusted access path rather than forwarding it publicly.

<span id="source-installation-advanced-custom-host-ports"></span>

## Custom Host Ports

- CapRover normally publishes HTTP on host port 80, HTTPS on 443, and the initial admin interface on 3000.
- On a fresh server, use those defaults.
- When another service already occupies a host port, change both the host side of the Docker mapping and the matching `CAPTAIN_HOST_*` setting:

```bash
sudo docker run -p 10080:80 -p 10443:443 -p 13000:3000 \
  -e ACCEPTED_TERMS=true \
  -e CAPTAIN_HOST_HTTP_PORT=10080 \
  -e CAPTAIN_HOST_HTTPS_PORT=10443 \
  -e CAPTAIN_HOST_ADMIN_PORT=13000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

- The container-side ports remain 80, 443, and 3000.
- Initial access in this example is `http://SERVER_IP:13000`.
- Open only the host ports required by your architecture.
- A public certificate flow and ordinary `https://your-domain` URLs still need external ports 80 and 443 routed to CapRover; changing its host ports alone does not route those standard ports.
- Plan your reverse proxy or port forwarding before enabling HTTPS.

CapRover passes these host-port values into its services at installation. Changing the published port of an existing installation requires extra care and is outside this fresh-install example.

<span id="source-installation-advanced-reverse-proxy"></span>

## Reverse Proxy Scenarios

- CapRover already runs NGINX for its dashboard and web applications.
- The simplest public installation lets CapRover own ports 80 and 443.
- If another reverse proxy must terminate traffic first, plan the routing before installing CapRover.

- The external proxy must pass requests for the dashboard and all application domains to CapRover, preserve the original `Host` header, support WebSocket upgrades for apps that need them, and handle certificate issuance and renewal deliberately.
- CapRover's own Let's Encrypt HTTP challenge needs its validation requests to reach CapRover on port 80.
- Terminating HTTPS at a proxy does not automatically provide HTTPS between the proxy and CapRover.

- For a fresh install behind a proxy that owns the standard host ports, see [Custom Host Ports](index.md) to publish CapRover on different host ports.
- Verify dashboard routing, a sample app, and certificate behavior before moving existing traffic.
- See [Cloudflare and Reverse Proxies](../../domains/cloudflare-reverse-proxies.md) for domain-level considerations.

Reverse proxy configurations depend on the proxy and the desired TLS boundary. This page does not prescribe a universal configuration; a tested provider-specific configuration is deferred.

<span id="source-installation-advanced-existing-swarm"></span>

## Existing Docker Swarm

- CapRover normally initializes Docker Swarm during installation.
- The `useExistingSwarm` configuration override lets the installer join an existing initialized Swarm instead.
- This is advanced: first understand how CapRover's manager, NGINX, registry, and persistent services will be placed on your nodes.

On the intended manager node, confirm that `sudo docker info` reports an active Swarm and that this node can manage it. Ensure the Swarm networking ports are open between trusted nodes: `2377/tcp`, `7946/tcp`, `7946/udp`, and `4789/udp`. Keep overlay traffic private.

Before first installation, write the override in CapRover's persistent directory:

```bash
sudo mkdir -p /captain/data
echo '{"useExistingSwarm":true}' | sudo tee /captain/data/config-override.json
```

- Then run the normal installation command from [Getting Started](../../get-started.md) on this manager node.
- The installer checks for an existing Swarm rather than creating one.
- Do this on a disposable or carefully planned cluster first: CapRover creates and manages services and networks in that Swarm, and its persistent state remains under `/captain` on the CapRover node.

For app scheduling beyond one node, a default push registry is required before adding nodes through CapRover. Read [Set Up a Multi-Node Cluster](../../scaling/multi-node.md) before deploying applications across nodes.

<span id="source-guides-home-server"></span>

## Home / Local Server Setup

For a local test, use [Local / Private Network installation](index.md). A public home deployment also needs a stable way for incoming traffic to reach the host.

1. Give the host a stable LAN address and install Docker as described in [Getting Started](../../get-started.md).
2. Before installing CapRover with the standard public-IP installer, temporarily forward TCP 80, 443, and 3000 from the router to that host. The installer checks all three ports against the detected public IP. Check provider and host firewalls too. A router without NAT loopback may still fail this self-check; use the [local/private installation path](index.md) with an explicit LAN IP if needed.
3. Install CapRover, then point wildcard DNS and the dashboard hostname to the router's public address. If your ISP changes that address, use a reliable DNS update process.
4. Complete the root-domain and HTTPS steps in [Getting Started](../../get-started.md), and verify the dashboard and a test app from a device **outside** the LAN.
5. After the dashboard works over HTTPS from outside the LAN, remove the public port 3000 forwarding rule and keep admin access through the dashboard hostname. Back up both CapRover state and application data off-site.

- Carrier-grade NAT, blocked inbound ports, or an IPv6-only connection can prevent normal public access and certificate issuance.
- In those cases use a public VPS, a suitable reverse proxy/tunnel with its own security model, or keep the installation private.
- Check your router and ISP before troubleshooting CapRover.
