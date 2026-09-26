---
id: openstack
title: OpenStack
slug: /installation/openstack
---

Use an OpenStack compute instance with a public or floating IPv4 address. The provider-specific names of images, flavors, and networks vary.

1. Create an Ubuntu 24.04 instance with an AMD64 or ARM64 image, at least 1 GB of RAM, an SSH key, and a network that provides outbound internet access.
2. Allocate and associate a public/floating IP if the instance did not receive one. Confirm you can SSH into it.
3. Configure its security group for inbound SSH, `80/tcp`, `443/tcp`, and `3000/tcp`. Add `443/udp` for HTTP/3 if desired. Match these rules in the guest firewall, if enabled.
4. Set your domain's wildcard A record to the public/floating IP.
5. Follow [Getting Started](../get-started.md) on the instance to install Docker and CapRover, initialize the dashboard, and deploy the sample HTTPS app.

The repository also contains an [older Heat template](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml), but it hardcodes the SSH key name, opens the setup and SSH ports to the internet, and contains an incorrect relative apt-source path. Do not deploy that template unchanged. Use the manual instance steps above unless you have reviewed and corrected it for your OpenStack environment.
