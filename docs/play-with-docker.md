---
id: play-with-docker
title: Play with CapRover
sidebar_label: Play with CapRover
---

<br/>

## View-only Demo

If you only want to see the view-only demo, go to the [home page](/) and click on **Live Demo**

<br/>

## Working Demo

If you want to create a working instance of CapRover, you can use Play-with-Docker website. This is a website that allows you to create Virtual Servers in seconds and install Docker images on it. This is the best play ground for playing with CapRover.

Follow these steps:
- Make sure you have an account on [Docker Hub](https://hub.docker.com/). If you don't, create one, it's 100% free.
- Go to [play-with-docker.com](http://play-with-docker.com/)
- Click on Start and log in using your Docker Hub username/password
- Once your session started you will see a page with a timer
- You can click on **+ADD NEW INSTANCE** on the left side menu bar and create a Virtual Server
- Once your server in created, copy and paste this command. Note that this slightly different from the standard installation command (extra parameter `MAIN_NODE_IP_ADDRESS`):
```bash
docker run -e MAIN_NODE_IP_ADDRESS='127.0.0.1' -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

- Wait for 30 seconds or more until the installation finished.
- Run the following command to see the progress of the installation process:

```bash
docker service logs captain-captain --follow
```

- Wait until you see this message *Captain is Ready* in the logs.
- Once you see that click on "3000" link at the top of the page.
- Login using the default password of `captain42`
- You should see the dashboard.
- Now go back to the other browser tab, where you have Play-With-Docker open
- Right click on "80" link (any of them) at the top of the page, and Copy Link Address.
- Go to CapRover dashboard and copy and paste the link in the Root Domain Section
- **IMPORTANT:** Remove `http://` prefix and the trailing `/` at the end
- Click on Update the Root Domain.
- You should be redirected and you can log in again with `captain42` as your password
- **IMPORTANT:** YOU CANNOT enable https using play-wth-docker, but other features should work normally.
- Congratulations! You have a fully functional CapRover version!