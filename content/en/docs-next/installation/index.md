---
id: index
title: Installation
slug: /installation
---

## Standard VPS {#source-installation-standard-vps}

**Requirements:**

- Ubuntu 24.04, public IPv4, SSH access
- AMD64 or ARM64, at least 1 GB RAM
- Root access and DNS control

**Setup:**

1. Create the server.
2. Allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp` in the provider firewall. Optional: `443/udp` for HTTP/3.
3. Point a wildcard A record (for example, `*.apps.example.com`) to the server IP.
4. Follow [Getting Started](../get-started.md) from Docker installation through the first HTTPS app.

**Notes:**

- Keep Docker Swarm inter-node ports private unless you are creating a cluster.
- If Docker is installed, verify `sudo docker version` and `sudo docker run --rm hello-world`. Avoid the snap installation.
- Review the [production checklist](../production-checklist.md) before hosting important data.

## DigitalOcean {#source-installation-digitalocean}

**Choose an installation:**

- **Fresh Ubuntu Droplet:** Follow the full [Getting Started](../get-started.md) guide.
- **[CapRover Marketplace image](https://marketplace.digitalocean.com/apps/caprover):** Docker and CapRover are preinstalled. Start at DNS setup in [Getting Started](../get-started.md).

**For both options:**

- **Server:** Public IPv4, SSH access, at least 1 GB RAM.
- **Firewall:** Allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp`. Optional: `443/udp` for HTTP/3.
- **DNS:** Point a wildcard A record (for example, `*.apps.example.com`) to the Droplet IP.
- **Verify:** Open `http://YOUR_SERVER_IP:3000`. Check that the dashboard and an app subdomain resolve before enabling HTTPS.

## OpenStack {#source-installation-openstack}

Use an OpenStack compute instance with a public or floating IPv4 address. The provider-specific names of images, flavors, and networks vary.

1. Create an Ubuntu 24.04 instance with an AMD64 or ARM64 image, at least 1 GB of RAM, an SSH key, and a network that provides outbound internet access.
2. Allocate and associate a public/floating IP if the instance did not receive one. Confirm you can SSH into it.
3. Configure its security group for inbound SSH, `80/tcp`, `443/tcp`, and `3000/tcp`. Add `443/udp` for HTTP/3 if desired. Match these rules in the guest firewall, if enabled.
4. Set your domain's wildcard A record to the public/floating IP.
5. Follow [Getting Started](../get-started.md) on the instance to install Docker and CapRover, initialize the dashboard, and deploy the sample HTTPS app.

- The repository also contains an [older Heat template](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml), but it hardcodes the SSH key name, opens the setup and SSH ports to the internet, and contains an incorrect relative apt-source path.
- Do not deploy that template unchanged.
- Use the manual instance steps above unless you have reviewed and corrected it for your OpenStack environment.

## Play with Docker {#source-installation-play-with-docker}

Play with Docker provides short-lived Docker hosts for trying CapRover without provisioning a VPS. Treat everything you deploy there as disposable. HTTPS certificate setup is not available in this environment.

1. Sign in to [Play with Docker](https://labs.play-with-docker.com/) and create a new instance.
2. In that instance's terminal, run the CapRover playground installer:

   ```bash
   curl -L https://pwd.caprover.com | bash
   ```

3. Wait for the installer to print a `captain.*.direct.labs.play-with-docker.com` URL. Open that URL and sign in with the initial password shown by the installer (historically `captain42`).
4. Change the initial password if you plan to use the session beyond a quick demo. Create an app and deploy an image to explore the dashboard.

- This playground script is separate from the [standard installation](../get-started.md).
- Use a regular server and your own domain for a durable HTTPS installation.
- Inspect a downloaded script before running it if you need to assess what it does.
