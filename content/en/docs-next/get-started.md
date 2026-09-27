---
id: get-started
title: Getting Started
slug: /get-started
---

This guide takes a fresh Ubuntu server from installation to a public CapRover application with HTTPS. The steps use the dashboard, so you do not need to install the CapRover CLI on your computer.

## What you need

- A fresh Ubuntu 24.04 server with a public IPv4 address, SSH access, and at least 1 GB of RAM. CapRover publishes AMD64 and ARM64 images. More memory is useful when building applications from source.
- A domain whose DNS records you can edit. In this guide, the root domain for CapRover is `apps.example.com`; replace it and the example IP address with your own values.
- Access to both your server's firewall and any firewall provided by your hosting company.

This guide assumes a single public server and the default HTTP, HTTPS, and admin ports. For a private network or different host ports, use the corresponding [installation guides](./installation/index.md) after the basic concepts here are familiar.

If you use [DigitalOcean's CapRover Marketplace image](./installation/digitalocean.md), Docker and CapRover are already installed. Check the provider firewall in step 1, skip the Docker and CapRover installation commands in steps 2–3, and continue at DNS after verifying the image's setup instructions. This guide uses a fresh Ubuntu host so the installation steps also work with other providers. For local experiments without a public domain, see [Local / Private Network](./installation/local-private-network.md); the normal public HTTPS flow here requires a reachable hostname.

## 1. Open the required ports

Allow inbound `80/tcp` for HTTP, `443/tcp` for HTTPS, and `3000/tcp` for initial dashboard access. Allow `443/udp` if you want HTTP/3. Keep SSH open so you can administer the server.

If UFW is your server firewall, run the following over SSH. Check that your provider firewall also permits these ports:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw allow 3000/tcp
sudo ufw status
```

If UFW is inactive and you plan to use it, enable it only after allowing SSH. A provider firewall can block traffic even when UFW allows it. Inbound `3000/tcp` is needed for setup; after the dashboard works over HTTPS through its domain, you may restrict or close public access to port 3000. See [Firewall](./domains/firewall.md) for other CapRover and Swarm ports.

## 2. Install and verify Docker

Run these commands on the Ubuntu server to install Docker Engine from Docker's official `apt` repository:

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

The last command should print a confirmation that Docker works. Use the official [Docker installation guide](https://docs.docker.com/engine/install/ubuntu/) if your server already has conflicting Docker packages or a different Ubuntu configuration. Avoid the snap package for this installation.

## 3. Install CapRover

Run this command on the server:

```bash
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

Wait for initialization to finish. CapRover creates its Docker Swarm services and persists its own configuration under `/captain`.

In your browser, open `http://YOUR_SERVER_IP:3000`. Sign in with the initial password `captain42`. If the page is unreachable, check `sudo docker service ls` on the server and confirm port `3000/tcp` is permitted in both firewalls.

## 4. Set up wildcard DNS

At your domain's DNS provider, create this record, replacing the example IP with your server's public IPv4 address:

| Type | Name in the `example.com` DNS zone | Value |
| --- | --- | --- |
| A | `*.apps` | `203.0.113.10` (your server IP) |

This one wildcard record covers both `captain.apps.example.com` and default app addresses such as `my-first-app.apps.example.com`. The bare `apps.example.com` needs its own DNS record if you intend to use it directly.

Check `captain.apps.example.com` and an unused name such as `random123.apps.example.com` with `dig +short` or an external [DNS lookup](https://mxtoolbox.com/DNSLookup.aspx). Both should resolve to your server IP. If your DNS provider has a proxy mode, use DNS-only mode during initial setup so CapRover can issue certificates against the server directly. DNS updates can take time to propagate; [Cloudflare and other reverse proxies](./domains/cloudflare-reverse-proxies.md) need their own validation after setup.

## 5. Initialize the dashboard and secure it

Choose the dashboard steps below or the CLI setup alternative following them. Both configure the same fresh installation.

While signed in at `http://YOUR_SERVER_IP:3000`:

1. Change the default password in the dashboard settings. Use the new password for the remaining steps.
2. Set the CapRover root domain to `apps.example.com`, without `*.` or `captain.`. The dashboard will then be reachable at `http://captain.apps.example.com`.
3. Check that the HTTP dashboard URL opens and your new password works.
4. Enable HTTPS for the CapRover dashboard in the dashboard settings. CapRover requests a certificate for `captain.apps.example.com`; ports 80 and 443 and the DNS record must already work.
5. Open `https://captain.apps.example.com` and confirm the browser shows a valid certificate. You can then enable **Force HTTPS** for the dashboard.

If certificate issuance fails, confirm that `captain.apps.example.com` resolves to this server and that inbound `80/tcp` and `443/tcp` reach it. See [HTTPS](./domains/https.md) for the full explanation.

### CLI setup alternative

On a **fresh** installation, you may initialize the root domain, new password, and dashboard certificate from your workstation with the CapRover CLI instead of the dashboard sequence above:

```bash
npm install -g caprover
caprover serversetup
```

Supply the server IP, the root domain `apps.example.com` (without `*.`), a new password, and a certificate email address when prompted. Start with working DNS and port 80 access. The setup command connects to the initial HTTP admin port and cannot complete after Force HTTPS redirects it; use `caprover login` against the HTTPS dashboard URL for an already configured server. See [CLI Commands](./reference/cli.md).

## 6. Create and deploy an application

1. In the dashboard, open **Apps** and create a new app named `my-first-app`. Leave it exposed as a web app.
2. Open its **Deployment** tab and paste this image-only Captain Definition into the deployment text box:

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

   Start the deployment.
3. In the app's HTTP settings, set the container HTTP port to `80` if it is not already `80`. Wait for the deployment to complete.
4. Visit `http://my-first-app.apps.example.com`. The NGINX welcome page confirms that DNS, CapRover routing, and the container are working.
5. Enable HTTPS for this app in its HTTP settings. Visit `https://my-first-app.apps.example.com` and confirm its certificate is valid. You can then enable **Force HTTPS** for the app.

You now have a dashboard and an application served over HTTPS. For your own source code, continue with [Deployments](./deployments/index.md). For environment variables and other app settings, use [Applications](./applications/index.md). To plan durable storage, read [Data & Persistence](./data-persistence/index.md) before deploying a database or other stateful service.

For a source-based test app instead of the image example, follow [Deploy with the CLI](./deployments/cli.md). Ordinary Git deployments archive the committed branch, so uncommitted files and files excluded by `.gitignore` are not uploaded.

## If a build runs out of memory

On a small server, check `free -h`, `swapon --show`, disk space, and the failed build logs. If RAM is insufficient and the host has spare disk, a swap file can help a short build finish. Check that `/swapfile` does not already exist or contain data before running these commands:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
free -h
```

To persist this new swap file across a reboot, add `/swapfile none swap sw 0 0` once to `/etc/fstab` and verify `sudo swapon --show` after reboot. Swap uses disk and is slower than RAM; a larger host or building an image in CI is preferable for repeated heavy builds.
