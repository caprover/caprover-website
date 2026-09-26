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

At your domain's DNS provider, create an **A** record for `*.apps.example.com` pointing directly to your server's public IPv4 address. For a DNS zone of `example.com`, the record name is usually `*.apps`. This one record covers both `captain.apps.example.com` and the default app addresses such as `my-first-app.apps.example.com`.

Check that both names resolve to the server IP before continuing. If your DNS provider has a proxy mode, use DNS-only mode during initial setup so CapRover can issue certificates against the server directly. DNS updates can take time to propagate.

## 5. Initialize the dashboard and secure it

While signed in at `http://YOUR_SERVER_IP:3000`:

1. Change the default password in the dashboard settings. Use the new password for the remaining steps.
2. Set the CapRover root domain to `apps.example.com`, without `*.` or `captain.`. The dashboard will then be reachable at `http://captain.apps.example.com`.
3. Check that the HTTP dashboard URL opens and your new password works.
4. Enable HTTPS for the CapRover dashboard in the dashboard settings. CapRover requests a certificate for `captain.apps.example.com`; ports 80 and 443 and the DNS record must already work.
5. Open `https://captain.apps.example.com` and confirm the browser shows a valid certificate. You can then enable **Force HTTPS** for the dashboard.

If certificate issuance fails, confirm that `captain.apps.example.com` resolves to this server and that inbound `80/tcp` and `443/tcp` reach it. See [HTTPS](./domains/https.md) for the full explanation.

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
