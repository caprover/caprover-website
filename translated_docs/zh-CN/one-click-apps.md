---
id: one-click-apps
title: 一键应用
sidebar_label: 一键应用
---

<br/>

CapRover 内置支持多个可以直接部署的常用应用。包括 WordPress、MySQL、MongoDB 等。

GitHub 上有一个 [One Click Apps 仓库](https://github.com/caprover/one-click-apps)，并且还在持续增加。

![OneClickAppsCapRover](/img/docs/one-click.gif)

<br/><br/>

#### 数据库和数据库 GUI
- MongoDB
- MongoExpress
- MsSQL
- MySQL
- Redis
- PhpMyAdmin
- PostgreSQL
- Adminer
- Apache CouchDB
- Gitea
- ElasticSearch
- 以及更多...
#### 博客和内容
- WordPress
- Ghost
- Prisma 1
- Strapi
- Minio
- 以及更多...
#### 开发工具
- Jenkins
- Drone.io
- Hasura
- Nexus3
- 以及更多...
#### 其他应用
- Parse
- NextCloud
- Rainloop
- Thumbor
- OhMyForm
- 以及更多...



<br/>

感谢 [@8byr0](https://github.com/8byr0)，我们有一个**由社区维护**的[应用目录](https://wizardly-ptolemy-8fcac8.netlify.app/)。源码见[这里](https://github.com/8byr0/caprover-sampleapps-browser)。


## 其他应用怎么办？
某个应用或数据库没有作为一键应用提供，并不意味着你不能部署它。你只需要搜索想要的应用的 Docker 镜像。例如，在 NextCloud 成为一键应用之前，你仍然可以像这样手动部署它
![nextcloud](/img/docs/nextcloud-deploy-manually.png)


在 CapRover v1 中，这比上面的方法更简单。因为 `captain-definition` 现在支持 `imageName`。你可以把下面的内容复制粘贴到你创建的应用的部署区域。当你只需要 `imageName` 时，不再需要创建 `tar` 文件：

```
{
  "schemaVersion": 2,
  "imageName": "nextcloud:12-rc"
}
```
你可以设置的全部环境变量列在它们的 DockerHub 页面：https://hub.docker.com/_/nextcloud/

<br/>

## 配置设置

它们都带有预配置设置，但你仍然可以自定义这些设置。例如，MySQL 数据库使用端口 3306，但如果需要，你可以把它改成其他端口。

需要注意的是，其中一些配置参数在部署后可能会作为环境变量出现在应用设置中，但它们的值只在安装阶段使用。也就是说，通过修改 PASSWORD 环境变量来修改 MySQL 密码是无效的。你应使用 MySQL 命令修改密码。PASSWORD 环境变量只用于在安装阶段设置初始密码。

## 升级一键应用

你部署了一键应用，过一段时间有了新版本，你想更新应用。不同应用的流程不同：

#### 简单镜像更新
大多数高质量应用允许你只更新底层镜像即可。这通常适用于大多数应用。例如，如果你有 MySQL 5.5，想升级到 5.7，只需打开 “Deployment” 标签，滚到页面底部，在 **Method 6: Deploy via ImageName** 中输入 mysql:5.7，然后点击 deploy。

镜像名称通常是 `imagename:version` 或 `account/image:version` 格式。你可以在部署历史中查看 CapRover 已部署的镜像。也可以在 DockerHub 查看新版本。例如，
- `mysql` 版本见：https://hub.docker.com/_/mysql?tab=tags
- `portainer/portainer` 版本见：https://hub.docker.com/r/portainer/portainer/tags

注意，还有一些场景中 CapRover 会修改原始镜像以提供更多功能。例如，redis 容器被修改以提供[认证选项](https://github.com/caprover/one-click-apps/blob/af172b6680583487bdeacf230d7abaf9b57f4811/public/v4/apps/redis.yml#L10-L12)。这种情况下，更简单的做法是删除应用并重新创建。如果你的应用有持久化数据，删除应用时**不要删除卷**，并且要用完全相同的名称重新创建应用，这样才会重新挂载同一个卷。



#### 其他情况
有些应用的升级方式不同，尤其是当它们有持久化代码数据时。WordPress 是一个很好的例子。要升级 WordPress，只需在 wordpress 网站面板内执行升级。有时除此之外，你还需要升级底层镜像，这时按上面的说明操作即可。


## 连接到数据库

### 在 CapRover 集群内连接

注意，因为这些应用都是 Docker 容器，你可以有多个 MySQL 数据库同时运行在端口 3306，而不会冲突。如果你想从 PHP 应用连接到两个不同的 MySQL 数据库，并且 PHP 和 MySQL 都在同一个 CapRover 实例下，可以使用 `srv-captain--mysqlappname1:3306` 和 `srv-captain--mysqlappname2:3306`。


### 远程连接

不过，如果你想从远程机器（例如笔记本）连接到数据库，就需要把容器端口映射到服务器端口。这时，你必须在服务器上映射两个不同端口，例如：
- 服务器端口 1001 指向 mysql-1 的端口 3306
- 服务器端口 1002 指向 mysql-2 的端口 3306

如果你想从远程机器连接到数据库，就需要端口映射。更多内容见 [Captain 配置 - 端口映射](app-configuration.md#port-mapping)。

完成端口映射后，可以在数据库客户端中输入这些值：
- Host：IP-ADDRESS-OF-SERVER
- Port：MAPPED-PORT-ON-HOST


例如，在上面的例子中，`mysql-1` 的 `MAPPED-PORT-ON-HOST` 是 `1001`，`mysql-2` 是 `1002`。

假设服务器 IP 是 `123.123.123.123`，映射端口是 `9999`：
- 对于 Mongo DB，使用 `mongodb://dbuser:dbpassword@123.123.123.123:9999/dbname`
- 对于 MySQL，使用 `HOST: 123.123.123.123`，`PORT: 9999`
- 以及其他...

**重要：** 完成端口映射后，确保打开服务器端口。例如，如果你把主机（服务器）端口 4444 映射到容器端口 3306，需要运行：

```
ufw allow 4444
```
