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
- Once your server in created, copy and paste this command:
```bash
docker run -e MAIN_NODE_IP_ADDRESS='127.0.0.1' -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

- Wait for 30 seconds or so until the installation finished.
- Run the following command to see the progress of the installation process:

```bash
 curl https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/play_with_caprover.sh | bash
```

- The installation process takes about 2 minutes and it's fully automated.
- When the installation process finishes, you'll see a message like this:
```
===================================
===================================
 **** Installation is done! *****  
CapRover is available at http://captain.ip123456789123456.direct.labs.play-with-docker.com
Default password is: captain42
===================================
===================================
```

Simply copy the URL and log into CapRover using `captain42` as your password!

**IMPORTANT:** YOU CANNOT enable https using play-wth-docker, but other features should work normally.
