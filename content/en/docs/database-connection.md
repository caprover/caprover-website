---
id: database-connection
title: Database Connection
sidebar_label: Database Connection
---

<br/>

All the databases that you deploy as a [one-click app](one-click-apps) are deployed as Docker containers. The name of each container is prefixed with `srv-captain--` in order to avoid clashing with other containers that might be running on the same host. All containers can talk to each other via Docker overlay network. The network architecture is something like this:


```bash
          Outside World
              +
              |
+---------+---+---+-----------------------------+
|         |       |                             |
|         | NGINX |                             |
|         |       |                             |
|      +--+-------+---+                         |
|      |              |                         |
|      |              |                         |
|  +---v--+     +-----v+      +-----------+     |
|  | App1 |     | App2 +------> Database1 |     |
|  +------+     +------+      +-----------+     |
|                                               |
+-----------------------------------------------+
```


### Internal Connections

The simplest type of connection is when you want to connect to `Database1` from `App2` in the diagram above. In this case, you can just connect to `srv-captain--database1` and specify the port. There is NO NEED for port mapping or extra config. Your code look like something like this:

```
databaseEngine.connect(
    {
        host: srv-captain--database1,
        port: 5000
    }
)
```


### External Connections

**IMPORTANT** if you're having issues with external connection, it's likely that you're an incorrect config. CapRover is battle tested and guaranteed to work. See a number of common mistakes [here](https://github.com/caprover/caprover/issues/364)

Sometimes, you need to connect to a database from the outside world. In this case you have two options:

1) Port Forwarding
This is the simplest solution. You simply navigate to App Config page on CapRover and map a arbitrary host port to the database port. For example, the default MySql port is `3306`, you can map port `12345` of the host to port `3306` of the container, and then, from your local machine, do something like this:

```
databaseEngine.connect(
    {
        host: <ip address of your CapRover server>,
        port: 12345
    }
)
```

Make sure you allow the host port on your firewall. Otherwise you won't be able to connect to your database.


2) SSH Tunneling
This method is more advanced. In order to do this, you first need to deploy an SSH one click app. You can select this from the official one click apps list on your CapRover instance. Make sure to choose a long and secure password. During setup, you will also be asked to provide a port to map this SSH image. By default it uses port `4646`. Make sure this port is allowed to pass through your firewall. Once this new image is deployed, you can now from your local machine run the following command:
```
ssh -L 8181:srv-captain--mysql:3306 root@<ip of your CapRover Server> -p 4646
```

This will map your local port of `8181` to MySQL Container's port `3306`. Now, from your local machine, you can run something like this:
```
databaseEngine.connect(
    {
        host: localhost,
        port: 8181
    }
)
```
**IMPORTANT:** Note that you are not able to SSH Tunnel to your database from the regular SSH on server. You **must** create an SSH container. SSH on the host is not able to talk to the container.

```bash

     HOST SYSTEM
    +-----------------------------------------------------------------+
    |                                 +-------------------+           |
    |                                 |                   |           |
    |                                 |  SSHD ON HOST     |           |
    |                                 +-------------------+           |
    |                                                                 |
    |                                                                 |
    |   DOCKER OVERLAY NETWORK (isolated environment)                 |
    | +-------------------------------------------------------------+ |
    | |                                                             | |
    | |    +----------------+         +--------------------+        | |
    | |    |                |         |                    |        | |
    | |    |  SSH Container |         | Database Container |        | |
    | |    |                +-------->+                    |        | |
    | |    +-----^----------+         +--------------------+        | |
    | |          |                                                  | |
    | +-------------------------------------------------------------+ |
    |            |                                                    |
    +-----------------------------------------------------------------+
                 |
                 |
                 |
       +-----------+
       |    YOU    |
       +-----------+
```
