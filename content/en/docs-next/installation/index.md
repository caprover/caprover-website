---
id: index
title: Installation Options
slug: /installation
---

For a standard Ubuntu server, follow [Getting Started](../get-started.md).

<span id="source-installation-standard-vps"></span>

## Standard VPS

- Ubuntu 24.04, AMD64/ARM64, public IPv4, root access, at least 1 GB RAM.
- Allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp` in provider firewalls. Optional: `443/udp` for HTTP/3.
- Set a wildcard A record (for example, `*.apps.example.com`) to the server's public IP.
- Avoid Docker installed via snap. For an existing Docker Engine, verify `sudo docker version` and `sudo docker run --rm hello-world`.

<span id="source-installation-digitalocean"></span>

## DigitalOcean

- **Fresh Ubuntu Droplet:** Follow [Getting Started](../get-started.md).
- **[CapRover Marketplace image](https://marketplace.digitalocean.com/apps/caprover):** Docker and CapRover are preinstalled. Continue at DNS and dashboard setup.
- **New DigitalOcean customers:** [Referral signup](https://m.do.co/c/6410aa23d3f3) for any currently available promotional credit. Offers vary.

The same firewall, RAM and wildcard DNS requirements apply to both options.

<span id="source-installation-openstack"></span>

## OpenStack

- Create an Ubuntu 24.04 instance with public/floating IPv4, SSH key, outbound connectivity and at least 1 GB RAM.
- Allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp` in security groups and the guest firewall.
- Point wildcard DNS to the public IP. Continue with [Getting Started](../get-started.md).

**Older Heat template:** The [existing template](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml) contains hard-coded values and problematic network/security defaults. Review and correct it before using it.

<span id="source-installation-play-with-docker"></span>

## Play with Docker (temporary demo)

For a read-only dashboard preview, use the **Live demo** link on [caprover.com](https://caprover.com/).

CapRover can run on [Play with Docker](https://labs.play-with-docker.com/):

```bash
curl -L https://pwd.caprover.com | bash
```

- Use the dashboard URL and initial password shown by the installer.
- The environment is **ephemeral** and does not support standard HTTPS certificate setup.
- Inspect downloaded scripts before executing them.
