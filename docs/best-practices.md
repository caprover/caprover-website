---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

CapRover is designed to be easy to use and intuitive. Having said that, there are a few tips and tricks that can help you get the most out of CapRover.

### Hidden Root Domain

It's always a good practice to hide your tech stack from the potential attacker. To be extra secure, you can hide your root domain two levels deeper than your wildcard DNS settings. For example on your DNS panel you set

```bash
A RECORD:

*.server.domain.com   >>>>   123.123.123.123
```

Then when setting up CapRover, instead of entering `server.domain.com`, enter `something.server.domain.com`. This way, you can access the dashboard via `captain.something.server.domain.com` and not `captain.server.domain.com`. You can then set your app's domain to `myapp.server.domain.com` under the app's HTTP settings to hide your root domain.

Keep in mind this is not a shield that protects you from everything. It's just a security measure that makes it harder, and nearly impractical for some brute force attackers to attack your CapRover infrastructure.

### Custom Default Password

CapRover uses `captain42` as its default password. This is usually safe as you can change your password by running `caprover serversetup` from your local machine right after the server installation is finished. However, this leaves a small window of 30 seconds or so for the attacker to change your password before you. This is very unlikely, but it's possible for this attack to happen. The attacker needs to know the exact attack window on a particular machine. Anyways, to mitigate this risk, simply choose a custom initial password when installing CapRover by adding `DEFAULT_PASSWORD` env var to the installation script. For example, the script below changes the default password from `captain42` to `myinitialpassword`

```bash
docker run -e ACCEPTED_TERMS=true -e DEFAULT_PASSWORD='myinitialpassword' -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

### Enforce HTTPS

It is highly recommended that one of the first things you do is to enable HTTPS and enable "Enforce HTTPS" for your CapRover dashboard. After you've done all these, you should change your password. Note that if you are using `caprover serversetup` wizard, you will be doing this process automatically, no need to change your password after the setup.

### Use Service Accounts for Git

One of the most popular features of CapRover is the automatic deployment from source control (GitHub, BitBucket, GitLab and etc...). For this approach to work with a private repository, you have to enter your username/password and they will be kept as encrypted content on your server. It is always a good practice to create a service account (bot account) on GitHub and etc, and give that account specific permission (read only) to certain repositories only. Such that if that account was compromised, your main owner account remains intact and you can remove the compromised account from the repo.

### Out of Memory when Building

When you build on a paid service such as Heroku, your build process happens on a machine with high CPU and RAM. When you use CapRover, your build is done on the same machine that serves your app. This is not a problem until your app gets too big and the build process requires too much RAM. In that case, your build process might crash! See [**this**](https://github.com/caprover/caprover/issues/315) for example. There are multiple solutions:

1- Add swap space to the web server, explained [**here**](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04).

2- Build on your local machine. For example, this process is explained in detail [**here**](recipe-deploy-create-react-app.md) for Create React App.

3- However, **the best solution** is to use a separate build system. You can see the guide [**here**](ci-cd-integration.md)

### Customize the NGINX Config for new apps

NOTE: this will be available starting version 1.11

To modify the default NGINX configuration for newly created apps to add in the IP whitelist and other NGIX config.

1- Obtain a copy of the `server-block-conf.ejs` template from the CapRover GitHub repository. [**here**](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs)

2- Create the file `/captain/data/server-block-conf-override.ejs`, copy the contents of the template, and make the desired modifications.
Assuming you start CapRover Docker with `-v /captain:/captain.`
