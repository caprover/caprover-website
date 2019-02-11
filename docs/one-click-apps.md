---
id: one-click-apps
title: One-Click Apps
sidebar_label: One-Click Apps
---

<br/>

CapRover has built-in support for several popular apps that can be deployed as is. These include WordPress, MySQL, MongoDB and many more.

There is a repository of [One Click Apps on GitHub](https://github.com/caprover/one-click-apps) and it's continuously growing.

![OneClickAppsCapRover](https://i.imgur.com/Tlgbkmy.png)


<br/>


## What about other apps?
Just because an app or database is not available as a one click app, it doesn't mean that you can't deploy it. All you need to do is to search for the Docker image of the app that you're looking for. For example, before NextCould was available as a one click app, you could still deploy it manually like this
![nextcloud](/img/docs/nextcloud-deploy-manually.png)


With CapRover v1, it's even easier than the method explained above. Since `captain-definition` now supports `imageName`. You can copy and past this into the deploy section of an app that you create. No more `tar` file creation is needed when all you need is `imageName`:

```
{
  "schemaVersion": 2,
  "imageName": "nextcloud:12-rc"
}
```
All the environmental variables that you can set are listed on their DockerHub page: https://hub.docker.com/_/nextcloud/

<br/>

## Configuration Settings

They all come with pre-configured settings, however, you'll be have the option to customize the settings. For example, MySQL database uses port 3306, but you can change this port to another port if it suits your needs.

It is important to mention that some of these configuration parameters, might show up as environmental variables in your app settings after you deploy the app, however, their values only being used in the installing phase. i.e., changing password of MySQL through changing the PASSWORD environmental variable will not work. Instead, you should use MySQL commands to change the password. The PASSWORD environmental variable is being used to set up the original password during the installation phase.

## Connecting to Databases

### Connecting Within CapRover Cluster

Note that since all these applications are Docker containers, you can have multiple MySQL databases on running on port 3306 without having any conflict. If you want to connect to two different MySQL databases, from a PHP app, where both PHP and MySQLs are under the same instance of CapRover, you can use `srv-captain--mysqlappname1:3306` and `srv-captain--mysqlappname2:3306`.


### Connecting Remotely

However, if you want to connect to your database from a remote machine (e.g. your laptop) you need to map a container port to a server port. In that case, you have to map two different ports on the server, for example:
- Port 1001 of the server goes to mysql-1 port 3306
- Port 1002 of the server goes to mysql-2 port 3306

Port mapping is needed if you want to connect to a database from a remote machine. You can read more about it [Captain Configuration - Port Mapping](app-configuration.md#port-mapping).

After port mapping, you can enter these values for your Database Client:
- Host: IP-ADDRESS-OF-SERVER
- Port: MAPPED-PORT-ON-HOST


For example, in the example explained above, `MAPPED-PORT-ON-HOST` is `1001` for `mysql-1` and `1002` for `mysql-2`.

Assuming your server ip is `123.123.123.123` and your mapped port is `9999`:
- For Mongo DB, you would use `mongodb://dbuser:dbpassword@123.123.123.123:9999/dbname`
- For MySQL, you would use `HOST: 123.123.123.123`, `PORT: 9999`
- and etc...

**IMPORTANT:** After port mapping is done make sure to open the server port. For example, if you mapped port 4444 of your host (server) to port 3306 of your container, you need to run the following command:

```
ufw allow 4444
```
