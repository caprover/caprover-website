---
id: cdd-migration
title: CaptainDuckDuck Upgrade
sidebar_label: CaptainDuckDuck Upgrade
---

Note: This section is only intended if you want to upgrade your CaptainDuckDuck server to CapRover.

### Migration Script

Simply run [this script](https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/migrate-from-cdd.sh) to upgrade your CaptainDuckDuck server to CapRover. It automatically creates a backup of your config directory `/captain` in case something goes wrong.


To migrate, you can simply run the following lines:

```
wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/migrate-from-cdd.sh

chmod +x migrate-from-cdd.sh

./migrate-from-cdd.sh
```


### Tips for Migration:

Make sure you have enough disk space. CapRover image is around 400MB and the script automatically backs up the config directory. 

#### Without Self-hosted Registry
You are most probably fine if you have around 1.5GB of free space on your server.

#### With Self-hosted Registry 
Self-hosted Registry can consume many many GB of disk space. Since Migration Script automatically creates a backup for your config directory, you may have problems during upgrade.

To save space, if you had Self-hosted Registry enabled, you have two options:
- you can manually edit the migration script and remove the backup line (`tar -cvf /captain-bk-$(date +%Y_%m_%d_%H_%M_%S).tar /captain`),
- or, you can remove all the content of registry by running `rm -rf /captain/registry/*` as it consumes a lot of disk space. Note that if you perform this action, you have to redeploy your apps in order for other nodes to be able to access it. If you only have one node, no extra action is needed. 


### Breaking Changes from CaptainDuckDuck to CapRover:
- `schemaVersion` for captain-definition file is changed to `2`.
- If you previously had to edit the custom port to something other than 80 for your specific app, you no longer need to edit NGINX config, you can simply set the container port to any port from the UI.
- If you previously used a customized dockerfileLines, you have prefixed all `ADD` and `COPY` statements with `./src`. This is no longer needed with CapRover. For example, you previously had 
```bash
COPY ./src/package.json /usr/app/
```

With CapRover you should change this to

```bash
COPY ./package.json /usr/app/
```