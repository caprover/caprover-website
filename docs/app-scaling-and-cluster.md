---
id: app-scaling-and-cluster
title: App Scaling & Cluster
sidebar_label: App Scaling & Cluster
---

<br/>

Captain offers you multiple ways to scale up your app, running it on multiple processes to take advantage of all the resources on your server.

## Run Multiple Instances of App:

Your Pizza app is doing great and you are getting thousands of hits on your website. Having one instance of your app is not good enough. Your latency has gone up. Next thing you want is to consider to run multiple instances of your app on your Captain. You can do this from the Apps section of Captain web. Let's say you change your instance count to 3. Captain creates 3 instances of your app running at the same time. If any of them dies (crashes), it automatically spins off a new one! You always have 3 instances of your Pizza app running! The best part? Captain automatically spreads the requests between different instances of your app. 

## Run Multiple Servers:

Wow! Your Pizza app is really popular! You have 3 instances of your app running on the same server, RAM and CPU are almost maxed out. You need to get a second server. How do you connect the servers? Captain does that for you ;-) You simply get a server with Docker installed on it, similar to what you did for the original Captain server. Make sure your shiny new server can be accessed via SSH from the original Captain server (e.g. by copying the Captain's ssh public key to your secondary server).

At this point, you have to enter the following information:
- CapRover IP Address (as seen by remote): this is the IP address of your original server
- New node IP Address (as seen by Captain): this is the IP address of your second server
- Private SSH key for `root` user: this is the SSH key from your CapRover server that will be used to SSH to your second server. On Linux, it's on `/home/yourusername/.ssh/id_rsa`
- Node type: this describes what the role of the new server is. Use `worker` if you're new to Docker, for more details, read https://docs.docker.com/engine/swarm/how-swarm-mode-works/nodes/

Now, go to the "Cluster" section of Captain, enter the values into fields of the "Nodes" area and click on Join Cluster. Done! You now have a real cluster of your own! You can now change the instance count to 6, and Captain will spin up some instances on the other server for you, also automatically load balances the request and creates new instances if one machine dies.

The leader node is a manager who's been elected as Leader. This is the node where Captain and main services such as nginx and Certbot (Let's Encrypt) will be running on. All your apps automatically get distributed to nodes by docker swarm.

Note that only apps without "Persistent Data" can be scaled across nodes. Apps that have "Persistent Data" enabled will only run on 1 node.


### Default Push Registry:

Default Push Docker Registry is a Docker Registry where your apps will be stored in as soon as you deploy them to server.

For cluster mode (more than one server) you will need to have a default push Docker Registry.


### Setup Docker Registry:

Docker Registry is simply the repository that different nodes in a cluster can access to download your app and run it. If only have one server (no cluster), there is pretty much no benefit to setting up Docker Registry.

On the other hand, Docker Registry needs to be set up and ready for clusters. To setup Registry, simply go to your Captain web dashboard, select Cluster from the menu, and follow the instructions. You will be given two options:
- Docker Registry managed by Captain.
- Docker Registry managed by a 3rd party provider.

For most cases, a Registry managed by Captain should be good enough. Note that before switching to cluster from a single node, if you have any existing app, you will have to setup Registry and re-deploy all your existing app to make sure they are pushed to the registry and are available to all nodes, not just the main leader node.


### More than one Registry:

You can be connected to more than one registry at a time. For example, you may be connect to a private Docker Registry on AWS and a private Docker Registry on DockerHub because some of your apps (images) are stored in your AWS private registry, some are on DockerHub.

Having said that, you can only have one default push registry. This is the registry where images will be pushed to once they are built on the server.


### Disabling Registry:

At any point in time, you have the option to:
- Disable Registry
- Delete Registry Auth Details

However, note that if you have a cluster (more than one server), if you remove your docker registry your apps may misbehave.
