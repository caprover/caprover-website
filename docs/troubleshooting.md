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

You might see Captain is getting restarted constantly due to an error. Fix the issue and retry. For example, see [error creating vxlan interface](https://github.com/caprover/caprover/issues/14#issuecomment-345447689), or [error while creating mount source path](https://github.com/caprover/caprover/issues/352). Linode, for example, has many problems, such as [subnet sandbox join failed](https://github.com/docker/machine/issues/2753#issuecomment-171822791) and [vxlan interface](https://github.com/docker/machine/issues/2753#issuecomment-188353704). Search [CapRover Github issues](https://github.com/caprover/caprover/issues) for your problem and if you can't find a solution, create a new issue on Github.

#### Second)

If you don't see any errors when your ran `docker service ps captain-captain --no-trunc`, then try

```bash
docker service logs captain-captain --since 60m
```

You might see that CapRover is getting restarted constantly due to an error. Search [CapRover Github issues](https://github.com/caprover/caprover/issues) for your problem and if you can't find a solution, create a new issue on Github.

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

## Domain Verification Failed - Error 1107!

This happens when CapRover cannot verify that yourcustomdomain.com points to the IP address of CapRover. This can be caused by several factors:

- DNS changes take up to 24 hrs to propagate, specially if your server had cached them before. So wait for 24hrs and retry again. If it doesn't work, proceed to the next step:
- To confirm, go to https://mxtoolbox.com/DNSLookup.aspx and enter `yourcustomdomain.com`. Make sure it points to the server IP. If you're using a proxy service like CloudFlare, this may cause a problem. Disable their proxy in your DNS on CloudFlare and have A record directly point to the IP address of your CapRover server.
- If you tested all above, and when you visit `something.domain.com` you see the CapRover page, then you can say your domain is working fine, but CapRover is unable to verify it because the loopback test doesn't work. In this case, you can choose to skip domain verification done by CapRover:

```
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker service update captain-captain --force
```

- If none of the above works, please open an issue on Github.
- **AWS EC2 Users** - Check to make sure the CIDR Block of your VPC is above 172.0.0.0/16 (NOT 0.0.0.0/16, which is common).

## Connection Timeouts

Sometimes when you have an inactive database connection pool, Docker drops the connection after some time. To fix, you can do either of these:

- Implement an automatic retry strategy
- Implement a automatic ping every few minutes to ensure that the connection doesn't become inactive
- Changing Keepalive config in your app (see [here](https://github.com/caprover/caprover/issues/873#issuecomment-715328966) for an example on knex)
- Make changes to your Docker configs (more advanced)

The [root cause](https://github.com/moby/moby/issues/31208) is not related to CapRover, it's an underlying Docker issue.

## Something bad happened

When you see this error in the UI, it means something "unexpected" went wrong such as connection lost, server crashing (due to out of memory), etc. The best way to see what's happening is to get the server logs:

```
docker service logs captain-captain --since 5m --follow
```

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

Run the nginx fixer to revert **all nginx changes that you've manually made**:

```bash
docker service scale captain-captain=0 && \
docker run -it --rm -v /captain:/captain  caprover/caprover /bin/sh -c "wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/clear-custom-nginx.js ; node clear-custom-nginx.js ;" && \
docker service scale captain-captain=1 && \
echo "OKAY"

```

Hopefully your problem should be resolved and you can be happy.

## How to restart CapRover

If your CapRover is not behaving well, you can try force restarting CapRover using:

```
docker service update captain-captain --force
```

## How to use the Edge version

Edge version gets automatically built with every push on master. If your version has a particular bug that is just fixed on master branch, you can temporarily update your CapRover to use the Edge version. Note that once you switch to edge, you won't receive updates. With the next release of CapRover, you have to manually switch back to CapRover. Note that this is an advance operations. Also, as a rule of thumb, once you switch to Edge, do not switch back to the regular version until a new version is released.

To switch to edge

```
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
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

After editing this file, [restart CapRover](https://caprover.com/docs/troubleshooting.html#how-to-restart-caprover) (if the change affects CapRover, nginx or certbot) or turn NetData off and on again from the UI.

## Use existing swarm

When you first install CapRover, it tries to automatically set up a swarm cluster for you. But in rare cases, you may already have a swarm cluster, and you want to use that cluster. In this case, you can simply just override it by setting `useExistingSwarm` to true. Run the following script before attempting to install CapRover.

```
mkdir -p  /captain/data
echo  "{\"useExistingSwarm\":\"true\"}" >  /captain/data/config-override.json
```

## AWS setup

AWS has its own customization with regards to port handling and etc. It make require some custom setup, see [this blog post for example](https://fuzzyblog.io/blog/caprover/2019/11/10/using-caprover-on-aws.html).

## CloudFlare SSL setup

When using CloudFlare free plan, keep in mind its [Universal SSL only supports SSL up to 1st level subdomains](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/#full-setup). So, if you enable CloudFlare's Universal SSL and set up a 1st level subdomain as a root domain for CapRover, you'll get the following error when trying to access the apps deployed by CapRover:

```
This site can’t provide a secure connection
app.root.example.com uses an unsupported protocol.
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

If you want to use CapRover with the CloudFlare's Universal SSL, avoid using a subdomain as a root domain.

## ARM processor

As of 1.8.1, CapRover works on arm processors like "raspberry pi" and such. Note that some one click apps may not work on rasberry pi. One click apps are external apps that are not maintained by CapRover.

## Reset Password

If you forgot your password but you have access to your server via SSH:

- SSH to your server
- Run

```bash
docker service scale captain-captain=0

# backup config
cp /captain/data/config-captain.json /captain/data/config-captain.json.backup

# delete old password
jq 'del(.hashedPassword)' /captain/data/config-captain.json > /captain/data/config-captain.json.new
cat /captain/data/config-captain.json.new > /captain/data/config-captain.json
rm /captain/data/config-captain.json.new

# set a temporary password
docker service update --env-add DEFAULT_PASSWORD=mytemppassword captain-captain
docker service scale captain-captain=1
```

- Login to CapRover with your temporary password and change your password from settings.

## How to stop and remove Captain?

CapRover uses docker swarm to support clustering and restarting containers if they stop. In order to fully uninstall CapRover from your system, run this:

```
docker service rm $(docker service ls -q)
## remove CapRover settings directory
rm -rf /captain
## leave swarm if you don't want it
docker swarm leave --force
## full cleanup of docker
docker system prune --all --force
```

## I got an email from Let's Encrypt saying my domain's SSL certificate is expiring, and it shouldn't be.

This can happen when you've used the same domain name for a previous project, which you then deleted.
Let's Encrypt keeps track of the old certificate and notifies you when it is due to expire, but this doesn't affect the new certificate.
To confirm, simply just check your SSL expiry date using an online tool like this:
https://www.sslshopper.com/ssl-checker.html#hostname=captain.server.demo.caprover.com
