---
id: persistent-apps
title: Persistent Apps
sidebar_label: Persistent Apps
---

<br/>

### Persistent or Not

When you want to create an app you have the option of creating the app with "Persistent Data" or not. By default, you should always prefer no persistence. However, they are cases where you need to create an app with persistence. Also, if you have a massive amount of static data that you don't want to bundle with your repository and have it shipped to the server everytime you build, you can map a directory on the host to a directory inside the container and FTP to your server and move your files there. This is generally not needed unless the amount of static data that you need to send to your server is extremely large.

#### Persistent Apps: 
These are the apps that have some data that need to survive restart, crash, container update and etc. Because these apps store data on disk, once they get created they get locked down on a specific server (if you have multiple servers). You can still change the constraint so that they will be moved to another machine, but if you do, they will lose anything that might have been stored on the current host. Examples that use persistent apps include:
- Any database that stores data on disk has to have persistent data enabled. Otherwise all data will be lost when the container restarts (due to crash, host restart and etc...)
- A photo upload app which does not use third party storages like Amazon S3 to store images. Instead, it locally stores uploaded images.
- A webapp that needs to store some user uploaded files and plugins locally on disk (like WordPress)

The main limitation of apps with Persistent Data is that they cannot be run as multiple instances. That's because they would access the same storage area and the data can be corrupted if multiple apps try to write on the same path.

Note that even for Persistent Apps, NOT ALL DIRECTORIES will be treated as persistent directories. After you created the app as an app with persistent data, you'll have to define directories that you want to be persistent in the app details page on web dashboard. You can let CapRover manage the stored directories for you (use labels), or use a specific path on the host (server).

##### Using label
In that case, they will be placed in `/var/lib/docker/volumes/YOUR_VOLUME_NAME/_data` on your server. The path inside the container is completely customizable. By default, the volume name will have `captain--` prepended to the field you enter (e.g. `my-volume` will become `captain--my-volume`)

##### Using specific path
For example, you can map `/var/usr` on your server to `/my-host-usr-something` in your container (app). This way you can save a file in your container at `/my-host-usr-something/myfile.txt` and the file will be available on your server (host) at `/var/usr/myfile.txt`. **Note** that, if you choose to use this option (specifying a specific host path), you'll have to make sure that the path already exists in your host before assigning it.

#### Removing Persistent Apps: 
Persistent directories need to be manually removed after you remove an app from Captain dashboard. This is to avoid accidental deletion of important data. To delete persistent directories, depending on the type of persistent directories, steps are different:
- Volumes (persistent directories mapped to a label):
![Volumes](/img/docs/label-path.png)
For this type, you need to run `docker volume ls` to see the names of the volumes, and then run `docker volume rm NAME_OF_VOLUME` to remove the volume
- Mapped directories on host: these are directories from your server that are mapped to a directory in your container (app). To remove them, simply remove the directory from your server via `rm -rf /path/to/directory`
![mapped](/img/docs/path-binding.png)

#### Non-Persistent Apps: 
Generally speaking, anything that does not directly store data on disk can be made non-persistent. You should always prefer to have non-persistent apps as they are much more flexible. Let's say you have multiple servers, if a server becomes unhealthly, all "non-persistent" apps on that server will automatically get moved to other servers whereas persistent apps are locked down to that server due to some data that they saved on that server.

Also, multiple instances of non-persistent apps can be running at the same time without causing any issues as they live in isolated environment and each of them has their very own disk space. Note that non persistent apps can still write data on disk, things on temporary cache and etc, but that data will get deleted once the container restarts due to a crash, deploy, configuration update or host restart. Examples include:

- A image processor which takes a photo and runs some logic to figure out what is in the picture. This is a good example of an app that can benefit from getting spawned as multiple instances as it's CPU heavy.
- A TODO web app. Note that this app will definitely uses some sort of database which is persistent. But the webapp itself does not store anything directly on disk.
- An image upload app that uses Amazon S3 as the storage engine rather than storing images locally on disk
