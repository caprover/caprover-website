---
id: disk-cleanup
title: Disk Clean-Up
sidebar_label: Disk Clean-Up
---

<br/>

Docker uses the disk in different ways:

## Docker Images
Saving your images: images are compressed files with your built source-code that you deployed to the server. Every time you deploy a new version of your code, Docker builds a new image for the new version and keeps the old image by default. If you want to clean up all "unused" images on your server, run 
```
docker container prune --force
docker image prune --all
```

Important Note: Use this approach only if you have a Docker registry set up (local or remote). This is due to an existing bug in Docker, see [here](https://github.com/caprover/caprover/issues/180) for more details on the problem and also see the related [Docker Issue](https://github.com/moby/moby/issues/36295)

## Docker Volumes
Volumes, aka "Persistent Directories". When you create an app with persistent data, like a database, you will assign it a persistent directory. When you change the persistent directory, or when you delete your app, you don't need the volumes anymore. Cleaning up orphaned volumes are tricky. If you have a useful volume for an app that is "currently" crashing and not-running, that volume is considered as "orphaned" by Docker :( So, to safely clean up orphaned volumes, first, check to see if all your services are running by:
```
docker service ls
```
Under REPLICAS, you should see `1/1`, `2/2` and etc. If you see a service that is not running, then do not proceed! Otherwise, go head and clean-up orphaned volumes by:
```
docker volume prune
```

Alternatively, you can first list all volumes, and delete only the ones that you don't want:
```
docker volume ls                          # lists all volumes
docker volume rm volume-name-goes-here    # removes a specific volume
```

## Removing local CapRover configuration file

The local CapRover configuration file can be found at `~/.config/configStore/caprover.json`. Deleting the file
should restore your disk to pristine state.

