---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

<br/>

This section covers most frequent issues that users may encounter.

## Cannot connect <ip_server>:3000?
There is a whole set of reasons for this.

#### First)
You need to make sure that CapRover is running on your server. To check this, ssh to your server and run 

```bash
docker service ps captain-captain --no-trunc
```

You might see Captain is getting restarted constantly due to an error. Fix the issue and retry. For example, see [error creating vxlan interface](https://github.com/caprover/caprover/issues/14#issuecomment-345447689), or [error while creating mount source path](https://github.com/caprover/caprover/issues/352). Linode, for example, has many problems, such as [subnet sandbox join failed](https://github.com/docker/machine/issues/2753#issuecomment-171822791) and [vxlan interface](https://github.com/docker/machine/issues/2753#issuecomment-188353704). Search [CapRover Github issues](https://github.com/CapRover/CapRover/issues) for your problem and if you can't find a solution, create a new issue on Github.

#### Second)
If you don't see any errors when your ran `docker service ps captain-captain --no-trunc`, then try

```bash
docker service logs captain-captain --since 60m
```

You might see that CapRover is getting restarted constantly due to an error. Search [CapRover Github issues](https://github.com/CapRover/CapRover/issues) for your problem and if you can't find a solution, create a new issue on Github.


#### Third)

If both "First" and "Second" debugging steps explained above worked fine and there is no error seen in the logs, run this command on your server:

```bash
 curl localhost:3000 -v
```
 
 If successful, it's probably your firewall that's blocking the connection. See [Firewall Docs](firewall.md).

## Successful Deploy but 502 bad gateway error!
This applies to you if:
- You have been able to setup your server and access it via `captain.rootdomain.example.com`.
- You have been able to deploy one of the samples apps (see [here](https://github.com/caprover/caprover/tree/master/captain-sample-apps)) successfully and it worked.
- You tried to deploy your own application and it deployed successfully, but when you try to access it via `yourappname.root.example.com` you get a 502 error.

If all above points are correct, this is how to troubleshoot:
- SSH to your server and view your application logs. Make sure it hasn't crashed and it's running. To view logs, please see the section at the end of this page "[How to view my application's log](#how-to-view-my-applications-log)"
- If you application logs show that your application is running, the most common case is that your application is binding to a custom port, not port 80. For example, CouchDB runs at port 5984. In this case, go to app's settings on CapRover, go to HTTP Settings, then select 5984 as the "Container Port".
- If your app defines the binding IP address as 127.0.0.1, change it to `0.0.0.0`, see [this issue](https://github.com/caprover/caprover/issues/76#issuecomment-481053496) for more details.

## Cannot Verify Domain!
This applies to you if everything is fine with the default domains (app.root.domain.com), however, when you want to connect a new domain to your app, you see "Cannot Verify" error. 

This happens when CapRover cannot verify that yourcustomdomain.com points to the IP address of CapRover. This can be caused by several factors:
- DNS changes take up to 24 hrs to propagate, specially if your server had cached them before. So wait for 24hrs and retry again. If it doesn't work, proceed to the next step:
- To confirm, go to https://mxtoolbox.com/DNSLookup.aspx and enter `yourcustomdomain.com`. Make sure it points to the server IP. If you're using a proxy service like CloudFlare, this may cause a problem. Disable their proxy in your DNS on CloudFlare and have A record directly point to the IP address of your CapRover server.
- If none of the above works, please open an issue on Github.

## How to view my application's log?
Your application is deployed as a Docker service. For example, if your app name in captain is `my-app` you can view your logs by connecting to your server via SSH and run the following command:
```
docker service logs srv-captain--my-app --since 60m --follow
```

Note that Docker service name is prefixed with `srv-captain--`. Also, you can replace 60m with 10m to view last 10 minutes.

## How to restart my application?
If your application is not behaving well, you can try force restarting it by going to the web dashboard and select your app, then click on "Save Configuration & Update" button. It will forcefully restarts your application.

## How to run shell inside my application (inside container)

Simply run the following command:
```
docker exec -it $(docker ps --filter name=srv-captain--myappname -q) /bin/sh
```

Of course, you need to replace `myappname` with your own app name.

## I've made a change to the Nginx config that broke the admin UI!

In this case restart is not going to help. [Do this](https://github.com/caprover/caprover/issues/412#issuecomment-484077130):

* SSH to server
* Run `docker service scale captain-captain=0`
* Run `cp /captain/data/config-captain.json /captain/data/backup-config-captain.json`
* Run `nano /captain/data/config-captain.json`
* Remove these two parameters from the json: `nginxBaseConfig` and `nginxCaptainConfig`, they should be toward the end of the JSON. Be careful with deleting, make sure the structure of JSON is valid, remove associated commas (`,`) as well.
* Run `docker service scale captain-captain=1`
* Hopefully your problem should be resolved and you can be happy.


## How to restart CapRover
If your CapRover is not behaving well, you can try force restarting CapRover using:
```
docker service update captain-captain --force
```

## How to use the Edge version
Edge version gets automatically built with every push on master. If your version has a particular bug that is just fixed on master branch, you can temporarily update your CapRover to use the Edge version. Note that once you switch to edge, you won't receive updates. With the next release of CapRover, you have to manually switch back to CapRover. Note that this is an advance operations. Also, as a rule of thumb, once you switch to Edge, do not switch back to the regular version until a new version is released.

To switch to edge
```
docker service update captain-captain --image caprover/caprover-edge:0.0.1
```

To switch back to the main image
```
docker service update captain-captain --image caprover/caprover:latest
```

## Customize Config Settings
You can customize any constant defined in [CaptainConstants](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) under configs by adding a JSON file at `/captain/data/config-override.json`. For example, to change `defaultMaxLogSize`, the content of `/captain/data/config-override.json` will be:
```
{
 "defaultMaxLogSize":"128m"
}
```

## AWS setup

AWS has its own customization with regards to port handling and etc. It make require some custom setup, see [this blog post for example](https://fuzzyblog.io/blog/caprover/2019/11/10/using-caprover-on-aws.html).

## How to stop and remove Captain?
Captain uses docker swarm to support clustering and restarting containers if they stop. That's why it keeps re-appearing. Try this:

```
docker service rm $(docker service ls -q)
## remove CapRover settings directory
rm -rf /captain
## leave swarm if you don't want it
docker swarm leave --force
## full cleanup of docker
docker system prune --all --force
```

