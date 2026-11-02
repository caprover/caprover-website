---
id: get-started
title: Getting Started
slug: /get-started
---

Install CapRover on Ubuntu 24.04 and deploy your first app with HTTPS.

## Requirements

- A fresh Ubuntu 24.04 server with a public IPv4 address and at least 1 GB RAM.
- A domain with full DNS access (including wildcard records like `*.example.com`).
- Root access to the server.

Using the [DigitalOcean Marketplace image](installation/index.md)? Skip steps 2 and 3. For installations without a public domain, see [Local / Private Network](installation/advanced/index.md).

## 1. Ports and firewall

Allow the following ports in your hosting provider's firewall and, if you use UFW, on the server:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # Dashboard setup
sudo ufw status
```

If UFW is inactive, enable it with `sudo ufw enable` **after** allowing SSH. You can restrict port 3000 once the dashboard works over HTTPS. See [Firewall](domains/firewall.md) for multi-node ports.

## 2. Install Docker

Run on the server:

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
sudo docker run --rm hello-world
```

If installation fails because of existing packages, follow [Docker's Ubuntu guide](https://docs.docker.com/engine/install/ubuntu/). Use Docker Engine rather than the snap package.

## 3. Install CapRover

```bash
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

When setup finishes, open `http://YOUR_SERVER_IP:3000`.

**Initial password:** `captain42`

If the dashboard is unreachable, check `sudo docker service ls` and the firewall rules from step 1.

## 4. DNS

Create an A record in your DNS provider:

| Type | Name (in `example.com`) | Value |
| --- | --- | --- |
| A | `*.apps` | Your server's public IPv4 address |

This guide uses `apps.example.com` as the CapRover root domain. The wildcard covers `captain.apps.example.com` and app domains such as `my-first-app.apps.example.com`.

Verify DNS:

```bash
dig +short captain.apps.example.com
dig +short test.apps.example.com
```

Both should return your server's IP. If using a DNS proxy such as Cloudflare, switch to **DNS only** during setup. The root hostname `apps.example.com` needs a separate record only if you plan to use it directly.

## 5. Configure CapRover

At `http://YOUR_SERVER_IP:3000`:

1. Change the default password.
2. Set the root domain to `apps.example.com` (without `*.` or `captain.`).
3. Open `http://captain.apps.example.com` and sign in.
4. Enable **HTTPS** for the dashboard.
5. Visit `https://captain.apps.example.com`, verify the certificate, then enable **Force HTTPS**.

If HTTPS fails, check DNS and ports 80/443. See [HTTPS troubleshooting](domains/index.md).

**CLI alternative:** On a fresh installation, run `npm install -g caprover` and then `caprover serversetup` from your computer before enabling Force HTTPS. See [CLI Commands](reference/cli.md).

## 6. Deploy your first app

1. Open **Apps** and create `my-first-app` as a web app.
2. Under **Deployment**, paste this Captain Definition and deploy:

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

3. Under the app's HTTP settings, set **Container HTTP Port** to `80`.
4. Open `http://my-first-app.apps.example.com`. You should see the NGINX welcome page.
5. Enable **HTTPS** for the app, verify `https://my-first-app.apps.example.com`, then enable **Force HTTPS**.

**Next:** [Deploy your own code](deployments/index.md) · [Configure apps](applications/index.md) · [Persistent data](data-persistence/index.md)

## Low-memory builds (optional)

If a build runs out of memory, check `free -h` and `swapon --show`. If you have spare disk space and `/swapfile` does not already exist:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

To keep swap after reboot, add `/swapfile none swap sw 0 0` **once** to `/etc/fstab`. For frequent builds, use more RAM or build in CI.

<span id="source-index"></span>

## Start

Find what you need:

- **New installation:** [Getting Started](get-started.md)
- **Apps and settings:** [Applications](applications/index.md)
- **Deployments:** [Deployments](deployments/index.md)
- **Server maintenance:** [Server Administration](server/index.md)
- **Problems:** [Troubleshooting](troubleshooting/index.md)
