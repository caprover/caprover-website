---
id: stateless-with-persistent-data
title: Stateless with Persistent data
sidebar_label: Stateless with Persistent data
---


**Before you start here, please read:**

* [Persistent Apps](persistent-apps.md)


This documentation will help you set-up a stateless app with persistant data. For example a website hosted with "**php:7.4-apache**" serving the "**uploads**" ( `/var/www/html/uploads` ) folder or any other folder you define from for example AWS or Wasabi S3, or any of the other [storage systems rclone supports](https://rclone.org/overview/). This makes it possible to have an otherwise pinned to node X app, to fail-over to a other node within the same Docker swarm.

There are multiple docker volume plugins to allow this set-up, I [@Daniël](https://caprover.slack.com/archives/DLR2Q4TC1) and my colleague Floris started out with "**rexray/s3fs**" but switched over to "**sapk/plugin-rclone**" as it was more stable, and handled fail-overs from node X to Y better.

---

**Important note:** The below steps are for intermediate and advanced (*linux*) users.

---

#### Placeholder variables

* `$volumename` can for example be `captain--yourappname-rclone`
* `$remotename` can for example be `captain--yourappname`
* `$remotename/path` can for example be `captain--yourappname/_data`
* `$rcloneremotename` can for example be `wasabi-s3`

---

### 1) Preparing rclone

You start by creating the `rclone.conf` file, this can be done on any (*local*) machine that has rclone installed.
For the ease of this documentation we'll assume you have [rclone installed](https://rclone.org/install/) on the primary node of your Docker swarm.

From this primary node, run "**[rclone config](https://rclone.org/commands/rclone_config/)**" to create the config file, when done run `rclone config file` to know where the config file is stored.
When you're using 'root' as you're user it will be stored in `/root/.config/rclone/rclone.conf` which we will use as a reference for the further writing of this guide.

The `rclone.conf` file will look like something like this:

```
[$rcloneremotename]
type = s3
provider = Wasabi
access_key_id = YourAccessKey
secret_access_key = YourSecretAccessKey
region = eu-central-1
endpoint = s3.eu-central-1.wasabisys.com
env_auth = false
upload_cutoff = 25M
chunk_size = 5M
disable_checksum = false
upload_concurrency = 3
```

Make sure each swarm node has the `/root/.config/rclone/rclone.conf` file, with the exact same content, double check by using `md5sum /root/.config/rclone/rclone.conf` and compare the checksums.
*Or at least make sure, if there are multiple configs avaiable, that the one you'll be using is the same*

### 2) Prepare your storage system

Make sure that your S3 bucket (or the folder you'll be using on the storage system you've configured via `rclone config`) actually exists and that the name of the bucket / folder matches the name of `$remotename`

### 3) Preparing the docker rclone plugin

On each swarm node install the docker volume plugin with the help of this command `docker plugin install sapk/plugin-rclone`

Then execute this command on each node, the below one was specially for "**php:N.N-apache**" containers ( _for example php:7.4-apache_ )

```
docker volume create --driver sapk/plugin-rclone --opt config="$(base64 /root/.config/rclone/rclone.conf)" --opt args="--uid 33 --gid 33 --allow-root --allow-other" --opt remote=$rcloneremotename:$remotename/path --name $volumename
```

If you have an S3 bucket, in which files get uploaded via either AWS / Wasabi web interface, or anything else such as SFTPGo mounted to the S3 bucket, then you'll need to tell rclone to refresh it's dir cache:

```
docker volume create --driver sapk/plugin-rclone --opt config="$(base64 /root/.config/rclone/rclone.conf)" --opt args="--uid 33 --gid 33 --allow-root --allow-other --dir-cache-time 5s" --opt remote=$rcloneremotename:$remotename/path --name $volumename
```

What happens is that "**[rclone mount](https://rclone.org/commands/rclone_mount/)**" mounts the volume on the Docker swarm node(s), though be aware that other flags/parameters can benefit or negatively impact your app experience so test them throughout.

**The above UID and GID are matched to Apache2 and can differentiate with other apps.**

### 4) Preparing the app

Then deploy a blank app with "**Has Persistent Data**" unchecked, and set-up it's parameters of you're liking under the "**HTTP Settings**", "**App Configs**" & "**Deployment**" tabs.

In the "**App Configs**" in the "**Service Update Override**" section, place the following.
Be aware that `/var/www/html/uploads` is a path / folder you should define yourself, but is used for referene here.

Set the "**ReadOnly**" value to either `true` or `false` based on what is appropirate to you're app.
If you're php app allows it's users to upload files, set it to `false`.

```
TaskTemplate:
  ContainerSpec:
    Mounts: [
      {
        "Type": "volume",
        "Source": "$volumename",
        "Target": "/var/www/html/uploads",
        "ReadOnly": false
      }
    ]
```

This way the application running on "*php:7.4-apache*" can move from node1 to any other nodes that are properly configured.

If you have a question, or run into issues, please get in contact via Slack in the General channel and if needed mention me [@Daniël](https://caprover.slack.com/archives/DLR2Q4TC1) and I or anyone else will try to help you out.
