---
id: manual
title: Manual Setup
slug: /installation/manual
---

Use this path to install Docker and bootstrap CapRover yourself on a fresh Ubuntu 24.04 server.

## 1. Ports and firewall

Allow the following ports in your hosting provider's firewall and, if you use UFW, on the server:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # Dashboard setup
sudo ufw status
```

If UFW is inactive, enable it with `sudo ufw enable` **after** allowing SSH. You can restrict port 3000 once the dashboard works over HTTPS. See [Firewall](../domains/firewall.md) for multi-node ports.

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

Continue with [DNS and dashboard setup](../get-started.md#dns).
