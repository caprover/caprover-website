---
id: get-started
title: Getting Started
sidebar_label: Getting Started
---

## Simple Setup

The recommended method to install CapRover is via DigitalOcean one-click app. CapRover is available as a One-Click app in DigitalOcean marketplace.

Note that if you are a new DigitalOcean user, you will receive **\$100 Free Credit** once you sign up for the first two months. This is enough for two months of multiple servers!

If you use this method, you can skip **Prerequisites** section and step 1 of **CapRover Setup** below!

<br/>

<a href="https://marketplace.digitalocean.com/apps/caprover?action=deploy&refcode=6410aa23d3f3" target="_blank" rel="noreferrer noopener">
<img src="/img/do-btn-blue.svg" alt="CreateDroplet" style="width:300px;"/>
</a>

<br/>

## Prerequisites

### A) Domain Name

During installation, you'll be asked to point a wildcard DNS entry to your CapRover IP Address. This will cost you as low as \$2 a year (or [even less](https://www.reddit.com/r/selfhosted/comments/sp8etq/comment/hwdgztx/?utm_source=reddit&utm_medium=web2x&context=3)!)

Note that you can use CapRover without a domain too. But you won't be able to setup HTTPS.

### B) Server

#### B1) Public IP

_Side note: You can [install CapRover locally](run-locally.md) on your laptop on a private network which is behind NAT (your router). But if you want to enable HTTPS and/or access the apps from outside of your private network, it requires some special setup, like port forwarding._

In standard installation, CapRover has to be installed on a machine with a public IP address. If you need help with Public IP, see [Server & Public IP address](server-purchase/digitalocean.md). This will cost you as low as $5 a month. If you use the DigitalOcean referral code, you'll get $100 credit - two months worth of free server: https://m.do.co/c/6410aa23d3f3

#### B2) Server Specs

_**CPU Architecture**:_ CapRover source code is compatible with any CPU architecture and the Docker build available on Docker Hub is built for AMD64 (X86), ARM64, and ARMV7 CPUs.

_**Recommended Stack**:_ CapRover is tested on Ubuntu 20.04 and Docker 19.03. If you're using CapRover on a different OS, you might want to look at [Docker Docs](https://docs.docker.com/engine/userguide/storagedriver/selectadriver/#supported-storage-drivers-per-linux-distribution).

_**Ubuntu 20.04**:_ There used to be some issues with Docker on Ubuntu 20, see [this one](https://github.com/moby/moby/issues/41825) and [another one](https://github.com/moby/moby/issues/41775) for example. Hence, previously we used to recommend Ubuntu 18.04 to minimize your production issues. But since late 2022, most issues in Ubuntu 20.04 are resolved, and [Ubuntu 18 has reached the end of its life](https://ubuntu.com/about/release-cycle).

_**Ubuntu 22.04**:_ The amd64 and aarch64 distributions have been tested by members of the Caprover community to be fully functional since its release. Ubuntu 22.04 will continue to receive security updates until April 2027 at least.

_**Minimum RAM**:_ Note that the build process sometimes consumes too much RAM, and 512MB RAM might not be enough (see [this issue](https://github.com/caprover/caprover/issues/28)). Most providers offer a minimum of 1GB RAM on \$5 instance including DigitalOcean, Vultr, Scaleway, Linode, SSD Nodes and etc.

#### B3) Docker

Your server must have Docker installed on it. If you get your server from DigitalOcean, you can select a server with CapRover one-click app and everything will be installed for you automatically. Otherwise, you can install Docker CE by following [this instruction](https://docs.docker.com/engine/installation). Note that your Docker version needs to be, at least, version 25.x+.

**AVOID snap installation** [snap installation of Docker is buggy](https://github.com/caprover/caprover/issues/501#issuecomment-554764942). Use the official installation instructions for Docker.

#### B4) Configure Firewall

Some server providers have strict firewall settings. To disable firewall on Ubuntu:

```bash
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377/udp;
```

See [firewall settings](firewall.md) if you need more details.

<br/>
<br/>

# CapRover Setup

## Step 1: CapRover Installation

Just run the following line, sit back and enjoy!

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

NOTE: do not change the port mappings. CapRover only works on the specified ports.

You will see a bunch of outputs on your screen. Once the CapRover is initialized, you can visit `http://[IP_OF_YOUR_SERVER]:3000` in your browser and login to CapRover using the default password `captain42`. You can change your password later. **However, do not make any changes in the dashboard**. We'll use the command line tool to setup the server (recommended).

## Step 2: Connect Root Domain

Let's say you own `mydomain.com`. You can set `*.something.mydomain.com` as an `A-record` in your DNS settings to point to the IP address of the server where you installed CapRover. Note that it can take several hours for this change to take into effect. It will show up like this in your DNS configs:

- **TYPE**: A record
- **HOST**: `*.something`
- **POINTS TO**: (IP Address of your server)
- **TTL**: (doesn't really matter)

To confirm, go to https://mxtoolbox.com/DNSLookup.aspx and enter `randomthing123.something.mydomain.com` and check if IP address resolves to the IP you set in your DNS. Note that `randomthing123` is needed because you set a wildcard entry in your DNS by setting `*.something` as your host, not `something`.

> **NOTE**: CapRover requires A Record to be pointing to CapRover's IP Address. If you use proxy services, such as Cloudflare, you may face difficulties. CapRover does not officially support such use cases.

## Step 3: Configure and initialize CapRover

### With CLI (recommended)

Assuming you have npm installed on your local machine (e.g., your laptop), simply run (add `sudo` if needed):

```bash
 npm install -g caprover
```

Then, run

```bash
 caprover serversetup
```

Follow the steps and login to your CapRover instance. When prompted to enter the root domain, enter `something.mydomain.com` assuming that you set `*.something.mydomain.com` to point to your IP address in step #2. Now you can access your CapRover from `captain.something.mydomain.com`. You can read more about hiding the root domain [here](./best-practices.md#hidden-root-domain).

> **NOTE**: **It will not be possible to carry through with the `caprover serversetup` if you've already forced https on your CapRover instance.**
> In such case go straight to logging in with the `caprover login` command. To change the password go to the settings menu in the app.

### With the web interface (doesn't require npm)

1. Login to `http://[IP_OF_YOUR_SERVER]:3000`
2. Configure the root domain
3. Enable HTTPS, then force it
4. Once you are connected through HTTPS, change the default password (`captain42`)

## Step 4: (Optional) Set up Swap file

In some cases you may run into problems due to not having enough physical RAM.
For example, when building a Docker image, if it starts to take up too much memory, the build will fail.
To work around these problems (without purchasing more RAM) you can set up a Swap file (which is used as virtual RAM),
by following these instructions on [How To Create A Linux Swap File](https://linuxize.com/post/create-a-linux-swap-file/).

## Step 5: Deploy the Test App

Go to the CapRover in your browser, from the left menu select Apps and create a new app. Name it `my-first-app`. Then, download any of the test apps <a href="https://github.com/caprover/caprover/tree/master/captain-sample-apps">here</a>, unzip the content. and while inside the directory of the test app, run:

```bash
/home/Desktop/captain-examples/captain-node$  caprover deploy
```

Follow the instructions, enter `my-first-app` when asked for app name. First time build takes about two minutes. After build is completed, visit `my-first-app.something.mydomain.com` where `something.mydomain.com` is your root domain.
CONGRATS! Your app is live!!

You can connect multiple custom domains (like `www.my-app.com`) to a single app and enable HTTPS and do much more in the app's settings page.

Note that when you run `caprover deploy`, the current git commit will be sent over to your server.

> **IMPORTANT**: Uncommitted files and files in `gitignore` WILL NOT be sent to the server.

You can visit CapRover in the browser and set custom parameters for your app such as environment variables, and do much more! For more details regarding deployment, please see [CLI docs](cli-commands.md). For details on `captain-definition` file, see [Captain Definition File](captain-definition-file.md).
