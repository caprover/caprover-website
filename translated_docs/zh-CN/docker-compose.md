---
id: docker-compose
title: Docker Compose
sidebar_label: Docker Compose
---

## 重要：

如果你关心 Docker Compose 支持，请在[这个问题](https://github.com/caprover/caprover/issues/2175)中留言。

## 什么是 Docker Compose？

对于 Docker 新手来说，你在网上找到的很多例子都是 Docker Compose。例如，这是一个简单的 WordPress Docker Compose：

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

它相当直观。它定义一个或多个服务（应用）以及它们的配置，例如持久化卷、映射端口、环境变量等。Docker compose 是一种非常简单、可读的方式，用来定义一组需要一起工作的应用。通常，要运行一个 docker compose 文件，你需要运行类似这样的命令：
```
docker-compose -f my-docker-compose.yml up
```


## 与 CapRover 的关系 - 不好的一面

CapRover 只是 Docker 外的一层薄封装。它使用 docker 来构建和运行应用。所有这些都通过 [Docker API](https://docs.docker.com/reference/api/engine/version/v1.43/) 完成。

虽然 Docker Compose 是 Docker CLI 中的一项功能，但它在 Docker API 中不可用。这意味着 CapRover 无法直接处理 docker compose 文件。


## 与 CapRover 的关系 - 好的一面

即便如此，CapRover 内置了一套系统，可以（部分）解析 docker-compose，并把它转换成 Docker API 能理解的部分。实际上，这正是 CapRover 一键应用的工作方式。一键应用只是 Docker Compose 文件的模板化变体。例如，这是 wordpress 的一键应用：

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

如你所见，上半部分和 Docker Compose 非常相似。


## 如何在 CapRover 上运行 Docker Compose


注意，如上所述，内置解析器并不支持 docker compose 中的所有字段。具体来说，它只支持：`image`、`environment`、`ports`、`volumes`、`depends_on` 和 `hostname`，其他参数目前会被 CapRover 忽略。

假设你的 Docker Compose 没有这些参数，或者它们对应用并不关键，你就可以这样运行 Docker Compose：

1) 打开 Apps

2) 点击 “One Click Apps/Databases”

3) 滚到列表最底部，点击最后一项，名为 `>> TEMPLATE <<`

4) 把下面这一段复制到输入框：


```yaml
captainVersion: 4
caproverOneClickApp:
    instructions:
        start: Just a plain Docker Compose.
        end: Docker Compose is deployed.
########
```

5) 在 `########` 之后，复制 Docker Compose 的全部内容。记住，通过 CapRover 部署时，服务会被加上 `srv-captain--` 前缀。因此如有需要请做相应更改。例如，完整的 wordpress docker compose 在 CapRover 中会像这样


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

## 带 CAP_ADD 标志的服务

如果你处理的是 OpenVPN 这类容器，它们通常需要特殊的 cap_add docker 标志。你可以像这样添加它们：

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


## 替代方法

如果无法用一键应用模板让它工作，还有另一个选项。你可以下载 compose 文件，然后运行 `docker compose up`，直接运行纯 docker compose。但在此之前，先把 `captain-overlay-network` 加入 docker compose yaml 文件的 Web 应用部分：
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

现在，不再使用你可能有的端口映射（例如 `8080:80`），你可以创建一个 CapRover “Nginx Reverse Proxy” 应用，并把容器名用作上游代理，例如 `http://web-app`，然后就完成了。
