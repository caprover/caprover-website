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

**IMPORTANT** just because an app or database is not available as a one click app, it doesn't mean that you can't deploy it. For example, before NextCould was available as a one click app, you could still deploy it manually like this
![nextcloud](/img/docs/nextcloud-deploy-manually.png)


<br/>

## Configuration Settings

They all come with pre-configured settings, however, you'll be have the option to customize the settings. For example, MySQL database uses port 3306, but you can change this port to another port if it suits your needs.

It is important to mention that some of these configuration parameters, might show up as environmental variables in your app settings after you deploy the app, however, their values only being used in the installing phase. i.e., changing password of MySQL through changing the PASSWORD environmental variable will not work. Instead, you should use MySQL commands to change the password. The PASSWORD environmental variable is being used to set up the original password during the installation phase.

## Connecting to Databases

Note that since all these applications are Docker containers, you can have multiple MySQL databases on running on port 3306 without having any conflict. If you want to connect to two different MySQL databases, from a PHP app, where both PHP and MySQLs are under the same instance of CapRover, you can use `srv-captain--mysqlappname1:3306` and `srv-captain--mysqlappname2:3306`.

However, if you want to connect to your database from a remote machine (e.g. your laptop) you need to map a container port to a server port. In that case, you have to map two different ports on the server, for example:
- Port 1001 of the server goes to mysql-1 port 3306
- Port 1002 of the server goes to mysql-2 port 3306

Port mapping is needed if you want to connect to a database from a remote machine. You can read more about it [Captain Configuration - Port Mapping](app-configuration.md#port-mapping).


**IMPORTANT:** After port mapping is done make sure to open the server port. For example, if you mapped port 4444 of your host (server) to port 3306 of your container, you need to run the following command:

```
ufw allow 4444
```
