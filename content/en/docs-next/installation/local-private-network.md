---
id: local-private-network
title: Local / Private Network
slug: /installation/local-private-network
---

You can run CapRover on a machine with a private IP for local testing or a home server. First decide whether it will be reachable only on your LAN or from the public internet. A private-only hostname cannot receive a public Let's Encrypt certificate through the usual HTTP challenge.

## Prepare the machine

Install Docker Engine and verify it with `sudo docker version`. Give the machine a stable LAN address. In this example it is `192.168.1.12`. Before installation, create `/captain/data/config-override.json` to skip the public DNS verification that is unsuitable for a private domain:

```bash
sudo mkdir -p /captain/data
echo '{"skipVerifyingDomains":true}' | sudo tee /captain/data/config-override.json
sudo docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 \
  -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

Use the machine's actual LAN IP in `MAIN_NODE_IP_ADDRESS`. From another LAN device, open `http://192.168.1.12:3000` and change the initial password. Allow these ports through the machine's firewall for your intended clients.

## Private-only domain

Configure a local DNS server to point `*.apps.home.example` to `192.168.1.12`, and set the CapRover root domain to `apps.home.example` in the dashboard. If your DNS server cannot create wildcard records, add `captain.apps.home.example` and each app subdomain individually. The hosts file on one computer does not provide wildcard DNS to other devices. Check name resolution from a client before creating an app.

Use HTTP on this private-only name. Do not enable CapRover's public Let's Encrypt flow for a domain that cannot resolve and be reached from the public internet.

## Public access through the router

For a public domain and HTTPS, point the wildcard public DNS A record to your router's public IPv4 address. Forward router port `80/tcp` to `192.168.1.12:80` and `443/tcp` to `192.168.1.12:443`. Forward `443/udp` if you want HTTP/3. The server must keep a stable LAN IP, and inbound connections must reach the router; carrier-grade NAT can prevent this setup.

Set the public root domain in CapRover, verify `captain.<root-domain>` resolves and reaches the server over HTTP, then enable dashboard and app HTTPS as described in [Getting Started](../get-started.md). Keep the admin port `3000` restricted to your LAN or another trusted access path rather than forwarding it publicly.
