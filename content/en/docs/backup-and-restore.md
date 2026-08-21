---
id: backup-and-restore
title: Backup & Restore
sidebar_label: Backup & Restore
---

### Backup & Restore

_This feature was added in v1.3.0._

_Backup/Restore feature is still in experimental stage. More changes to come in the future._

Backup/restoration is a complicated process and requires understanding of how different components work in CapRover instance. If you plan to use this feature, make sure you read this document thoroughly, and practice with a test server and learn the process before actually using this feature in production.

**TDLR;** Normal backup/restore works for everything except images and volumes. For images, you have to use a Docker Registry (has pros and cons), for volumes, you have to use a custom solution (has pros and cons).

### Backup Process

On your working CapRover instance, open the web dashboard, navigate to settings page, and click on "Create Backup" button. After a few seconds download will start. Keep the tar file and you will use this when restoring the CapRover instance.

#### Automating backup process

You can create a simple bash script for automated backups:

```bash
    API_TOKEN=$(curl $CAPROVER_URL/api/v2/login \
        -H 'x-namespace: captain' \
        -H 'content-type: application/json;charset=UTF-8' \
        --data-raw "{\"password\":\"$CAPROVER_PASSWORD\"}" \
        --compressed --silent | jq -r ".data.token")

    DOWNLOAD_TOKEN=$(curl $CAPROVER_URL/api/v2/user/system/createbackup \
        -H "x-captain-auth: $API_TOKEN" \
        -H 'x-namespace: captain' \
        --data-raw '{"postDownloadFileName":"backup.tar"}' \
        --compressed --silent | jq -r ".data.downloadToken")

    if [ ${#DOWNLOAD_TOKEN} -le 10 ]; then
        echo "DOWNLOAD_TOKEN must be at least 10 char long"
        exit 1
    fi

    wget "$CAPROVER_URL/api/v2/downloads/?namespace=captain&downloadToken=$DOWNLOAD_TOKEN" -O backup.tar
```

### Restoration Process

This process is very similar to fresh installation of CapRover, except a few differences. Follow the steps for Prerequisites from [Get Started](get-started.md), and make sure you have Docker installed on a server.

_DO NOT_ run the installation command `docker run -p 80:80 -p 443:443.....`. Instead do the following steps:

_(replace 123.123.123.123 with your server IP in instructions below)_

1. Create an empty `/captain` directory on your server by running <br/> `ssh root@123.123.123.123 mkdir /captain`
2. Rename your desired backup file to `backup.tar` on your desktop.
3. Copy `backup.tar` to server: <br/> `scp ./backup.tar root@123.123.123.123:/captain/`
4. Install CapRover:

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

CapRover will automatically detect your `backup.tar`, extract it and restores all your configs and settings.

5. You need to configure your DNS such that `*.youroldroot.domain.com` points to the new server IP.

### Keeping Old Server

In some cases, you still have the previous server running, and you just want to create a clone of your server. Since you want your old server to keep running, you shouldn't change your DNS for the old domain. Instead, you want to assign a new one. In this case:

1. Create a new wildcard entry in your DNS `*.yournewroot.domain.com` and point it to the new server
2. On your desktop machine, create a temporary entry in your `etc/hosts` file and add this line

```
NEW-SERVER-IP-ADDRESS   captain.oldroot.domain.com
```

NOTE that you cannot use wild card in hosts file, just add the domain for the dashboard so you can access it temporarily.

3. go to `captain.oldroot.domain.com` in your browser and login to the dashboard.

NOTE that you might see an SSL error, you can click on advance and ignore. This is fine as your SSL certification might have been expired. It will get renewed once you set everything up and restart CapRover.

4. After logging in to the dashboard, go ahead and change your root domain to `yournewroot.domain.com` on the dashboard.

5. Re-enable SSL certifications and Force HTTPS for your dashboard and other apps if you want.

6. Edit your `etc/hosts` and remove the line you added in step 2.

### What is Restored?

CapRover backup process backs up everything in your `/captain/data/` directory. This includes your app settings, configurations, SSL certificates and etc. What it does not include are: **Container Images** and **Persistent Directories**

1. **Container Images:** After restoring an instance of CapRover, you will notice that your app configurations are set, however, all your apps are reverted to the default state of "Your App Will Be Here!". You do need to redeploy all your apps. The good things about this approach is that your `backup.tar` file is really small and manageable. The cons of this approach, of course, is having to perform a re-deploy for all your apps. If you really want the images to be saved in a backup, you need to use a [Docker Registry](#d-r).
2. **Persistent Directories:** Some apps, like databases, have a persistent directory. Since each database has its own backup mechanism. It is recommended to use the proper method of backup for your specific database, like `mongodump` for MongoDB or `mysqldump` for MySQL and etc. This is the best approach for databases as it does not cause a down time. The other approach is to create a snapshot of volumes. This approach is generic and works on pretty much everything. For example, you can use this [3rd Party Project](https://github.com/loomchild/volume-backup). However, before running this, to avoid data corruption, you need to make sure that your containers are stopped `docker service ls --format {{.Name}} | while read in; do docker service scale "$in"=0; done` and then take a snapshot then resume all services `docker service ls --format {{.Name}} | while read in; do docker service scale "$in"=1; done`. In near future, CapRover will have a built-in solution like this.
   Other useful tools for backing up your persistent directories are:

- https://github.com/futurice/docker-volume-backup
- https://github.com/loomchild/volume-backup
- https://github.com/blacklabelops/volumerize
- https://github.com/schickling/dockerfiles/tree/master/postgres-backup-s3
- https://github.com/schickling/dockerfiles/tree/master/mysql-backup-s3

<details>
  <summary>Docker Registry</summary>


### Docker Registry Instructions

As noted above, container images are not part of the backup. To ensure that your apps do not require a re-deploy after the restoration process, you need to make sure that you're using a Docker Registry. A Docker Registry is a place where images for your apps will be stored.

#### 3rd Party Registry

If you set the "default push registry" in your CapRover dashboard under Cluster section, every image will get pushed to the registry once it's built on the server. This is the best option as it's a separate entity and you are not responsible for keeping your images. Once you restore your CapRover instance, everything just works like a charm!

#### Self Hosted Registry

If you set the "default push registry" to CapRover self-hosted registry, your app will work out of the box after the restoration process. However, on the negative side, your `backup.tar` will be very big. This file will include all images that are built on your server.

If you had previously set the self-hosted registry, but you changed your mind and disabled the self-hosted registry to switched to a 3rd party registry, your backup files will still be big as the files are still sitting on your host system. If you want to purge all images stored in your registry, delete the registry directory `rm -rf /captain/data/registry`

</details>

<details>
  <summary>Multi-Node setup</summary>


### Multi Nodes

What happens when you have a cluster? Backup and restoration process is pretty much the same as single node, except during the restoration, the first run exits after it detects that you're trying to restore a cluster. Your are asked to edit a file and add IP addresses of new nodes.

For example, previously you had 2 nodes:

- 222.222.222.10 (Main node)
- 222.222.222.11

For restoration you have prepared 2 nodes:

- 222.222.222.20 (Main node)
- 222.222.222.21

You run the restoration script on `222.222.222.20` and the script exits asking you to enter the information for the second node. You edit the restoration instructions file and enter `222.222.222.21` as the new IP for the old IP of `222.222.222.11`.

Next, you need to copy your private key (usually named `id_rsa`) to your server. For example, on linux:

```bash
scp /home/myuser/.ssh/id_rsa root@123.123.123.123:/captain/
```

_Make sure to delete this file from the server once the restoration process is finished_

Now re-run the restoration script (the same one that exited and asked for more info). Now this process goes through and your nodes will be restored, apps will be adjusted to move to the new nodes. For example if previously, you had a persistent app locked on the second node, it'll be locked to the second node in the restored instance as well.

Volume restoration for the cluster is a bit more complicated. But if you are using a cluster, you probably know what you are doing :-)

</details>
