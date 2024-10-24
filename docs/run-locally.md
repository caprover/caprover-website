---
id: run-locally
title: Run Locally
sidebar_label: Run Locally
---

<br/>
Note that this is an **advanced process**. Some of the concepts used in this section are not easy for the beginners. In order to run CapRover on your local machine (just for testing and development) you need Docker installed on your machine.

<br/>

> Note: If you prefer visual tutorials, please refer to this community created tutorial on YouTube: https://www.youtube.com/watch?v=J_6H11DrzXY

As for the root domain, by default, CapRover uses `http://captain.captain.localhost`. On most systems, `captain.captain.localhost` automatically resolves to local ip address of the machine, i.e. 127.0.0.1 and therefore no additional work is needed.

> However, if it doesn't do that automatically, you need to manually point `*.captain.localhost` to `127.0.0.1` or `192.168.1.2` (your local ip). **NOTE** that `etc/hosts` won't be enough as Captain needs a wildcard entry and `etc/hosts` does not allow wildcards, i.e. `*.something`. On ubuntu 16, `dnsmasq` (a local DNS server) is built-in. So, it's as simple as editing this file: `/etc/NetworkManager/dnsmasq.d/dnsmasq-localhost.conf` (create it if it does not exist) and adding this line to it: `address=/captain.localhost/192.168.1.2` where `192.168.1.2` is your local IP address. To make sure you have `dnsmasq`, you can run `which dnsmasq` on your terminal. If it's available, its path will be printed on the terminal, otherwise, there won't be anything printed on your terminal.
> Note: For Ubuntu 18, read https://askubuntu.com/questions/1029882/how-can-i-set-up-local-wildcard-127-0-0-1-domain-resolution-on-18-04

To verify that you have both prerequisites mentioned above:

- Run `docker version` and make sure your version is at least the version mentioned in the [docs](get-started.md#c-install-docker-on-server-at-least-version-1706x)
- Run `nslookup randomstring123.captain.localhost` and make sure it resolves to `127.0.0.1` or your local ip (something like `192.168.1.2`):

```
Server:		127.0.1.1
Address:	127.0.1.1#53

Name:	randomstring123.captain.localhost
Address: 192.168.1.2
```

## Installation

Once you have confirmed that you have the prereqs ready, you can go ahead and install Captain on your machine, similar to what you do on your server. Make sure you run as a user with sufficient permission, i.e. `sudo` on linux based systems. Just follow the steps outlined here: [Captain Installation](get-started#step-1-captain-installation), except for a few differences mentioned below.

### Differences:

#### Main IP

First of all, the installation command for local installation requires an extra parameter (`MAIN_NODE_IP_ADDRESS`)

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=127.0.0.1 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```
**NOTE:** if port 80 and 443 are currently occupied and you want to run CapRover behind a reverse proxy, [see here](https://github.com/caprover/caprover/issues/1166#issuecomment-2430704491).

#### Setup

Do not run `caprover serversetup`. Instead, go to http://captain.captain.localhost:3000 and manually set root domain to `captain.localhost`. DO NOT enable/force HTTPS. Obviously, you cannot enable HTTPS on your local domain (captain.localhost).

Once you set your root domain as `captain.localhost`, use `caprover login` and enter `http://captain.captain.localhost` as your captain URL and `captain42` as your default password.

> However, if you want to access your CapRover instance from another device on your LAN, you can set the root domain to `captain.LOCAL_IP.sslip.io` (for example `captain.192.168.1.2.sslip.io`).

**NON-LINUX USERS**
You need to add `/captain` to shared paths.
To do so, click on the Docker icon -> Setting -> File Sharing and add `/captain`

You are set!

## Install CapRover on a Private [local] Network

This is handy when you want to install CapRover on your home network, for example on a Raspberry pi.

Imagine you have this network:

```
┌───────────────────────┐
│    Your Router        │
│                       │
│     public IP         │
│    11.22.33.44        │           your private network
├───────────────────────┴─────────────────────────────────────────────────────────────────────┐
│                                                                                             │
│ ┌────────────────┐      ┌──────────────────┐        ┌──────────────────┐                    │
│ │                │      │                  │        │                  │                    │
│ │    PC1         │      │     PC2          │        │       PC3        │                    │
│ │                │      │                  │        │                  │                    │
│ │  192.168.1.10  │      │    192.168.1.11  │        │    192.168.1.12  │                    │
│ │                │      │                  │        │                  │                    │
│ └────────────────┘      └──────────────────┘        └──────────────────┘                    │
│                                                                                             │
│                                                                                             │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

You can install CapRover on PC3 by simply running this command:

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

The only extra bit is this: ` -e MAIN_NODE_IP_ADDRESS=192.168.1.12` and also disabling domain verification on CapRover.

At this point, you should be able to access your CapRover dashboard from PC1 and PC2 via `http://192.168.1.12:3000` on your browser.

Still you aren't able to deploy apps, but the dashboard should be accessible.
If the dashboard isn't accessible, you have an internal firewall that prevents PC1 from accessing PC3.

If the dashboard is accessible, move on to the next stages.

### option 1 - only internal usecase:

You can install CapRover on your internal network so that it's only accessible from your private network. If you want to do that, you have to assign `*.caproverinstance.local` or something similar in your local DNS server to point to `192.168.1.12`. If you don't have a local DNS server you cannot do this.

Some local DNS servers, like PiHole, don't allow wildcard in the local DNS entries, in that case, you have to add `captain.caproverinstance.local` to point to the IP. and in the future, add your apps names one by one. It's tedious but doable.

Now, go to the dashboard via `http://192.168.1.12:3000` and update the root domain to `caproverinstance.local`.

At this point, you should be able to access the dashboard via `http://captain.caproverinstance.local` in your browser.
If you are having problem here, it means your local DNS server isn't working as expected. You'll have to fix it.

Note that you should not (cannot) enable HTTPS for internal domains.

### option 2 - make the instance accessible from the outside.

requirement: your public IP address must be a static IP address.

This is very similar to how you install CapRover on a publicly available VPS. All you need to do is to enable port forwarding on your router:

```
port 80 of router => port 80 of 192.168.1.12
port 443 of router => port 80 of 192.168.1.12
```

Now use your regular DNS provider and map `*.domain.com` to the public IP address of your network.

Now, like a normal installation, just login to `http://192.168.1.12:3000` and update the root domain to `domain.com`

At this point, your instance should be accessible from `http://captain.domain.com`. You can enable HTTPS and deploy your apps.

## Troubleshooting:

As mentioned above, running a local machine is an advanced task and might fail due to different reasons, depending on the error, your solution might be different. For example, if you get the following error:

```
Captain Starting ...
Installing Captain Service ...
December 18th 2017, 11:51:11.295 pm    Starting swarm at 34.232.18.13:2377
Installation failed.
{ Error: (HTTP code 400) bad parameter - must specify a listening address because the address to advertise is not recognized as a system address, and a system's IP address to use could not be uniquely identified
    at /usr/src/app/node_modules/docker-modem/lib/modem.js:254:17
    at process._tickCallback (internal/process/next_tick.js:180:9)
  reason: 'bad parameter',
  statusCode: 400,
  json:
   { message: 'must specify a listening address because the address to advertise is not recognized as a system address, and a system\'s IP address to use could not be uniquely identified' } }
```

You can try this:

```bash
docker run -e ACCEPTED_TERMS=true -e "MAIN_NODE_IP_ADDRESS=192.168.1.2" -v /var/run/docker.sock:/var/run/docker.sock caprover/caprover
```

and replace `192.168.1.2` with your own local IP.
