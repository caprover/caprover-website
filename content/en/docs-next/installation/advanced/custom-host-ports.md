---
id: custom-host-ports
title: Custom Host Ports
slug: /installation/advanced/custom-host-ports
---

CapRover normally publishes HTTP on host port 80, HTTPS on 443, and the initial admin interface on 3000. On a fresh server, use those defaults. When another service already occupies a host port, change both the host side of the Docker mapping and the matching `CAPTAIN_HOST_*` setting:

```bash
sudo docker run -p 10080:80 -p 10443:443 -p 13000:3000 \
  -e ACCEPTED_TERMS=true \
  -e CAPTAIN_HOST_HTTP_PORT=10080 \
  -e CAPTAIN_HOST_HTTPS_PORT=10443 \
  -e CAPTAIN_HOST_ADMIN_PORT=13000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

The container-side ports remain 80, 443, and 3000. Initial access in this example is `http://SERVER_IP:13000`. Open only the host ports required by your architecture. A public certificate flow and ordinary `https://your-domain` URLs still need external ports 80 and 443 routed to CapRover; changing its host ports alone does not route those standard ports. Plan your reverse proxy or port forwarding before enabling HTTPS.

CapRover passes these host-port values into its services at installation. Changing the published port of an existing installation requires extra care and is outside this fresh-install example.
