---
id: docker-compose
title: Docker Compose
sidebar_label: Docker Compose
---


## What is Docker Compose?

For Docker newbies, lots of examples that you find on the internet are Docker Compose. For example, this is a simple Docker Compose for WordPress:

```yaml
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db-data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
       WORDPRESS_DB_NAME: wordpress
volumes:
    db-data: {}
```

It is pretty self-explanatory. It defines one or multiple services (apps) and their configurations such as persistent volumes, mapped ports, environment variable and etc. Docker compose is a really easy and readable way to define a set of apps that need to be working together. Usually to run a docker compose file, you need to run something like:
```
docker-compose -f my-docker-compose.yml up
```


## Relationship to CapRover - Bad

CapRover is just a thin layer around Docker. It uses docker to build and run your applications. It does all of these through [Docker API](https://docs.docker.com/engine/api/v1.40). 

Although Docker Compose a feature in Docker CLI, it is NOT available in Docker API. This means CapRover cannot handle docker compose files.


## Relationship to CapRover - Good

Having said that, CapRover has a built in system to parse out docker-compose (partially) and converts it to pieces that Docker API understands. In fact, this is exactly how CapRover one click apps work. One click apps, are just templatized variant of Docker Compose files. For example, this is the one click app for wordpress:

```yaml
captainVersion: 4
services:
    $$cap_appname-db:
        image: $$cap_db_type:$$cap_database_version
        volumes:
            - $$cap_appname-db-data:/var/lib/mysql
        restart: always
        environment:
            MYSQL_ROOT_PASSWORD: $$cap_db_pass
            MYSQL_DATABASE: wordpress
            MYSQL_USER: $$cap_db_user
            MYSQL_PASSWORD: $$cap_db_pass
        caproverExtra:
            notExposeAsWebApp: 'true'
    $$cap_appname-wordpress:
        depends_on:
            - $$cap_appname-db
        image: wordpress:$$cap_wp_version
        volumes:
            - $$cap_appname-wp-data:/var/www/html
        restart: always
        environment:
            WORDPRESS_DB_HOST: srv-captain--$$cap_appname-db:3306
            WORDPRESS_DB_USER: $$cap_db_user
            WORDPRESS_DB_PASSWORD: $$cap_db_pass
caproverOneClickApp:
    variables:
        - id: $$cap_db_user
          label: Database user
          defaultValue: wordpressuser
          validRegex: /^([a-zA-Z0-9])+$/
        - id: $$cap_db_pass
          label: Database password
          description: ''
          validRegex: /.{1,}/
        - id: $$cap_wp_version
          label: WordPress Version
          defaultValue: '4.9'
          description: Check out their Docker page for the valid tags https://hub.docker.com/r/library/wordpress/tags/
          validRegex: /^([^\s^\/])+$/
        - id: $$cap_db_type
          label: Database Type
          defaultValue: mysql
          description: You can either choose mariadb or mysql, you need to change the version according to which DB is selected. It is case sensitive.
          validRegex: /^(mysql|mariadb)$/
        - id: $$cap_database_version
          label: Database Version, default is MySQL
          defaultValue: '5.7'
          description: Check out the Docker pages for the valid tags https://hub.docker.com/r/library/mysql/tags/ or https://hub.docker.com/_/mariadb?tab=tags
          validRegex: /^([^\s^\/])+$/
    instructions:
        start: >-
            WordPress is an online, open source website creation tool written in PHP. But in non-geek speak, it’s probably the easiest and most powerful blogging and website content management system (or CMS) in existence today.
             Enter your WordPress Configuration parameters and click on next. A MySQL (database) and a WordPress container will be created for you.  The process will take about a minute for the process to finish.
        end: >
            Wordpress is deployed and available as $$cap_appname-wordpress . 
             IMPORTANT: It will take up to 2 minutes for WordPress to be ready. Before that, you might see a 502 error page.
    displayName: WordPress
    isOfficial: true
    description: WordPress is a content management system based on PHP and MySQL that is usually used with the MySQL or MariaDB database
    documentation: Taken from https://docs.docker.com/compose/wordpress/. Port mapping removed from WP as it is no longer needed
```

As you can see, the top part is very similar a Docker Compose!


## How to Run Docker Compose on CapRover


Note that, as mentioned above, the built-in parser does not support all fields that are available in docker compose. Specifically, it only supports: `image`, `environment`, `ports`, `volumes`, `depends_on`, and `hostname`, other parameters are currently being ignored by CapRover.

Assuming that your Docker Compose doesn't have any of these parameters, or they are not crucial for your application, you can simply run Docker Compose by

1) Navigate to Apps

2) Click on "One Click Apps/Databases"

3) Navigate to the very bottom of the list, and click on the last item, called `>> TEMPLATE <<`

4) Copy the following section to the box:


```yaml
captainVersion: 4
caproverOneClickApp:
    instructions:
        start: Just a plain Docker Compose.
        end: Docker Compose is deployed.
########
```

5) After `########`, copy the entire content of your Docker Compose. Keep in mind that your services will get prefixed with `srv-captain--` when deployed via CapRover. Hence make changes if needed. For example, the complete wordpress docker compose will look like this in CapRover


```yaml
captainVersion: 4
caproverOneClickApp:
    instructions:
        start: Just a plain Docker Compose.
        end: Docker Compose is deployed.
########
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db-data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: srv-captain--db:3306 ## NOTICE it is changed to "srv-captain--db" from "db"
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
       WORDPRESS_DB_NAME: wordpress
volumes:
    db-data: {}
```

## Service with CAP_ADD Flag

If you are working on a container like OpenVPN, they often require special cap_add docker flag. You can add them like this:

```yaml
captainVersion: 4
services:
    openvpn:
        caproverExtra:
            containerHttpPort: 943
        image: linuxserver/openvpn-as:2.9.0-5c5bd120-Ubuntu18-ls124
        environment:
            PUID: 1000
            PGID: 1000
            TZ: UTC
            INTERFACE: ""
        volumes:
            - openvpn:/config
        ports:
            - 9443:9443
            - 1194:1194
        cap_add:
            - NET_ADMIN
caproverOneClickApp:
    displayName: OpenVPN Access Server
    isOfficial: false
    description: Full featured secure network tunneling VPN software.
    documentation: https://openvpn.net/index.php/access-server/overview.html
    instructions:
      start: Just a openvpn Docker Compose with cap_add.
      end: Docker Compose is deployed.
```


## Alternative Approach

If you can't make it work with a one click app template, there is another option! You can simply run pure docker compose by download the compose file and run `docker compose up`. But before that just add `captain-overlay-network` to your web application section of your docker compose yaml file:
```
  web-app:
    image: .....
    container_name: ......
    networks:
      - captain-overlay-network

networks:
  captain-overlay-network:
    external: true
```

Now instead of potential port mapping that you might have, like `8080:80`, you can just create a CapRover "Nginx Reverse Proxy" app and use your container name as the upstream proxy, like `http://web-app` and done!

