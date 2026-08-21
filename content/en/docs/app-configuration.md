---
id: app-configuration
title: App Configuration
sidebar_label: App Configuration
---

<br/>

## HTTP Settings

This is where all HTTP related stuff sits. If your app is not an HTTP app, you can simply check "Do not expose as web app". This is used for anything that is not a webapp, like a database such as MongoDB or MySQL.

![httpsettings](/img/docs/app-http.png)

By default, any webapp that you deploy gets a Captain domain assigned to it in this format: `appname.root.domain.com`. However, you have the option to add as many domains as you want to this app. For example, you can add `www.myawesomeapp.com` and `myawesomeapp.com`.

There are also some advanced options such as Edit Default Nginx config and Container HTTP Port which you usually do not need to edit.

#### Enabling HTTPS

CapRover has built-in support for Let's Encrypt and it enables you to easily put your websites behind secure HTTPS without being concerned with the cost of SSL certificates (Let's Encrypt is free) and without any hassle of setting up configs and renewing certificates.

To enable HTTPS for any domain, just click on enable HTTPS! It takes a few seconds and it's done!

After enabling HTTPS, you can optionally, although very recommended, enforce HTTPS for all requests, i.e. denying plain insecure HTTP connections and redirect them to HTTPS.


## App Config

This is where you can set runtime configuration and settings.

![appconfig](/img/docs/app-vars.png)

### Environment Variables

One of the most basic configuration that you can set for your app is environment variables. These variables are usually used to pass in data that does not live in the code. Examples, include API key for a 3rd party service, database connection URI and etc. 

You can simply set the environmental variables on the dashboard and use them dynamically in your code, e.g., `process.env.VAR_NAME_HERE` for NodeJS, or `$_ENV["VAR_NAME_HERE"]` in PHP. 

If you'd like to access these variables during build time, you can use ARG command to your Dockerfile.

```
FROM imagename....
ARG VAR_NAME_HERE=${VAR_NAME_HERE}
ENV VAR_NAME_HERE=${VAR_NAME_HERE}

## At this point, "VAR_NAME_HERE" is available as an env var during your build,
## you can do something like this:
## RUN echo $VAR_NAME_HERE
```

As well as the variables you set yourself, CapRover will also set a `CAPROVER_GIT_COMMIT_SHA` environment variable to the full git commit SHA that is being deployed. This is only available during the Docker build and is not available inside your app by default. If you want to use it inside your app then you can use something like the following:

```
FROM imagename....
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
```

### Port Mapping

CapRover allows you to map ports from a container to the host. You should use this feature if you want a specific port of your apps/containers to be publicly accessible. The most common use case is when you want to **connect to a database container from your local machine**.

Note that even if you don't set any port mapping, all ports are accessible from other containers on the same Captain cluster. Therefore, you should only use this option if you want the port to be publicly accessible. Make sure to have the port open, see [firewall settings](firewall.md).

For example, if you want your NodeJS app to access your MongoDB database, and you do not need to access your MongoDB from your laptop, you don't need Port Mapping. Instead, you can use the fully qualified name for the MongoDB instance which is `srv-captain--mongodb-app-name` (replace `mongodb-app-name` with the app name you used).

### Persistent Directories

Only used for [persistent apps](persistent-apps.md).

### Node ID

Only used for [persistent apps](persistent-apps.md). Persistent apps need to be locked down to a particular node (if you have a cluster of servers). NodeId defines what node this app should be locked down to.

### Service Tags

_available as of 1.11_

You can mark caprover services with special tags. This allows you to better group and view your apps in the table.

### Instance Count

How many instances of this app should run at the same time. You may run as many instances as you'd like. However, you are limited by your hardware. If you increase this number and you don't have enough RAM or Disk space, your system may crash. It is advised to consider performance implications before increasing this number.

### Predeploy Function

This is a [very dangerous and advanced option](pre-deploy-script.md). Do not use it unless you really know what you are doing.
