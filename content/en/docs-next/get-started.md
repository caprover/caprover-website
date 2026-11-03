---
id: get-started
title: Getting Started
slug: /get-started
---

Install CapRover on a fresh Ubuntu 24.04 server.

## Requirements

- AMD64 or ARM64 server, public IPv4, sudo/root access.
- At least 1 GiB RAM and 5 GiB free disk space.
- A domain with wildcard DNS access.
- Public inbound TCP ports **80**, **443**, and **3000** allowed by your hosting provider.

<span id="step-1-caprover-installation"></span>

## Install CapRover

On the server:

```bash
sudo apt update && sudo apt install -y curl
curl -fsSL https://get.caprover.com -o caprover-install.sh
sudo bash caprover-install.sh --check
sudo bash caprover-install.sh
```

- [Installer source and options](https://github.com/caprover/caprover/tree/master/scripts/user/installer). Review the downloaded script before running it as root.
- `--check`: read-only checks for OS, RAM, disk, Docker, Swarm, ports, and firewall conflicts. Resolve blocking issues before installing.
- The installer installs Docker Engine when absent and preserves existing Docker workloads.
- On an active UFW firewall, it allows TCP 80/443/3000. It leaves inactive UFW and hosting-provider firewalls unchanged.
- After installation, it checks external port reachability and reports warnings. DNS, dashboard configuration, and HTTPS remain manual.

**Other methods:** [Manual Setup](installation/manual.md) (Docker and CapRover commands), [DigitalOcean Marketplace](installation/index.md), or [Advanced Installation](installation/advanced/index.md) for private networks, existing Swarms, and custom ports.

<span id="step-2-connect-root-domain"></span>

## DNS

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

<span id="step-3-configure-and-initialize-caprover"></span>

## Configure CapRover

Open `http://YOUR_SERVER_IP:3000`. **Initial password:** `captain42`.

- Change the password and set the root domain to `apps.example.com` (without `*.` or `captain.`).
- Dashboard hostname: `captain.apps.example.com`. Enable HTTPS and Force HTTPS once DNS and certificate issuance work.
- Restrict public access to `3000/tcp` after dashboard HTTPS is working.

For certificate failures, check DNS and inbound TCP 80/443. See [Domains & HTTPS](domains/index.md).

**CLI alternative:** Install the CLI with `npm install -g caprover` and run `caprover serversetup` from your computer. See [CLI Commands](reference/cli.md).

<span id="step-5-deploy-the-test-app"></span>

## Deploy your first app

1. Open **Apps** and create `my-first-app` as a web app.
2. Under **Deployment**, paste this Captain Definition and deploy:

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

3. Set **Container HTTP Port** to `80`.
4. Open `http://my-first-app.apps.example.com`. You should see the NGINX welcome page.
5. Set up HTTPS for the app in its HTTP settings when DNS and port 80 are reachable.

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
