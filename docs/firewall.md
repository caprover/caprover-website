---
id: firewall
title: Firewall & Port Forwarding
sidebar_label: Firewall & Port Forwarding
---

<br/>


Captain uses:
- 80   TCP for regular HTTP connections
- 443  TCP/UDP for secure HTTPS and HTTP/3 connections
- 3000 TCP for initial Captain Installation (can be blocked once Captain is attached to a domain)
- 7946 TCP/UDP for Container Network Discovery
- 4789 TCP/UDP for Container Overlay Network
- 2377 TCP/UDP for Docker swarm API
- 996  TCP for secure HTTPS connections specific to Docker Registry

In case of an ubuntu server, run 

```
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377,443/udp;
```


Note that for a more secure installation you can only expose 80/443/3000 to the world, the rest of the ports are only used in a cluster, and it would suffice to make them open to the other nodes in the cluster. 
If you have a single instance, just run:

```
ufw allow 80,443,3000
```


Also, if you are using Port Mapping to allow external connections, for example from your laptop to a MySQL instance on Captain, you will have to add the corresponding port to the exclusion as well.


NOTE:
Docker bypasses ufw for mapped ports. If you have manually added a mapped port for any of your apps deployed under CapRover, ufw does not necessarily block the ports. See the [relevant information here](
https://askubuntu.com/questions/652556/uncomplicated-firewall-ufw-is-not-blocking-anything-when-using-docker)

