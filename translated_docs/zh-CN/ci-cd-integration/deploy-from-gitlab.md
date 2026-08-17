---
id: deploy-from-gitlab
title: 从 GitLab 部署
sidebar_label: 从 GitLab 部署
---



在本教程中，我们会介绍通过 GitLab 部署。GitHub 也非常相似。如果途中遇到任何问题，请告诉我们。



### 1- 创建 GitLab 仓库

如果你没有 GitLab 账号，先创建一个。
- 点击 “New Project” 创建新仓库
- 点击 “Create blank project”
- 为项目命名并完成项目创建



### 2- 添加示例源码

本教程使用一个非常简单的示例源码，只包含一个文件

`index.php`
```php
 <?php echo 'PHP output: Hello World!'; ?> 
```

把这个文件添加到 GitLab 仓库，commit 并 push。你应能在 GitLab 的 Web UI 中看到这个文件。



### 3- Dockerfile

要在第三方构建系统上构建，你需要有一个 Dockerfile。如果你使用 CapRover templateId，可以使用 [CapRover 仓库中现成的 Dockerfiles](https://github.com/caprover/caprover/tree/ff3d124f967ee06732c13774e9e633d33b0982c4/dockerfiles)。

本教程使用 PHP Dockerfile：

`Dockerfile`
```Dockerfile
FROM php:7.3-apache
COPY ./ /var/www/html/
```

**重要** 确保你的 `Dockerfile` 拼写与此完全一致。

添加、commit 并 push 这个文件。



### 4- 为 CapRover 创建 Access Token

CapRover 需要从 GitLab 拉取已构建的镜像，因此我们需要创建一个 access token。打开 [User settings > Personal access tokens](https://gitlab.com/-/user_settings/personal_access_tokens) 并创建一个 token。

确保为这个 token 分配 `read_registry` 和 `write_registry` 权限。

创建 token 后进入下一步：



### 5- 把 Token 添加到 CapRover

登录 CapRover Web 控制台，在 `Cluster` 下点击 `Add Remote Registry`。然后填写这些字段：

- Username：`your gitlab username`
- Password：`your gitlab Token [From the previous step]`
- Domain：`registry.gitlab.com`
- Image Prefix：`again, your gitlab username`

注意：Image Prefix 取决于你在 Gitlab 中如何组织项目。如果你的仓库使用了 group，image prefix 应是你的 group。
一般来说，image prefix 是域名和镜像名称之间的部分。例如，对于这个项目，`my-group-project` 就是 Image Prefix：
```
registry.gitlab.com/my-group-project/test:latest
```

保存你的 registry。



### 6- 禁用 Default Push

添加 registry 后，CapRover 默认会把构建产物推送到你的 registry。本教程不需要这样做，而且它可能导致部署失败。因此请禁用 `Default Push`



### 7- 创建 CapRover 应用

在 CapRover 控制台上创建一个应用，我们把它叫做 `my-test-gitlab-deploy`



### 8- 创建 CI/CD 变量

接下来，打开 GitLab 上的项目页面，进入 `Settings > CI/CD`。然后在 `Variables` 下添加以下变量：
- `Key`：`CAPROVER_URL`，`Value`：`https://captain.root.domain.com [replace it with your domain]`
- `Key`：`CAPROVER_PASSWORD`，`Value`：`mYpAsSwOrD [replace it with your password]`
- `Key`：`CAPROVER_APP`，`Value`：`my-test-gitlab-deploy [replace it with your app name]`

添加全部这 3 个变量。为了更好的安全性，确保它们是 protected。即使它们没有 masked 也可以，它们不会出现在日志中。



### 9- GitLab CI 文件

到目前为止，我们的目录中有两个文件：`index.php` 和 `Dockerfile`。现在加入 GitLab 专用的构建说明：

**重要** 确保你的 `.gitlab-ci.yml` 拼写与此完全一致。它以一个点开头。


`.gitlab-ci.yml`
```yaml
build-docker-master:
  image: docker:19.03.1
  stage: build
  services:
    - docker:19.03.1-dind
  before_script:
    - export DOCKER_REGISTRY_USER=$CI_REGISTRY_USER # built-in GitLab Registry User
    - export DOCKER_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD # built-in GitLab Registry Password
    - export DOCKER_REGISTRY_URL=$CI_REGISTRY # built-in GitLab Registry URL
    - export COMMIT_HASH=$CI_COMMIT_SHA # Your current commit sha
    - export IMAGE_NAME_WITH_REGISTRY_PREFIX=$CI_REGISTRY_IMAGE # Your repository prefixed with GitLab Registry URL
    - docker login -u "$DOCKER_REGISTRY_USER" -p "$DOCKER_REGISTRY_PASSWORD" $DOCKER_REGISTRY_URL # Instructs GitLab to login to its registry

  script:
    - echo "Building..." # MAKE SURE NO SPACE ON EITHER SIDE OF = IN THE FOLLOWING LINE
    - export CONTAINER_FULL_IMAGE_NAME_WITH_TAG=$IMAGE_NAME_WITH_REGISTRY_PREFIX/my-build-image:$COMMIT_HASH
    - docker build -f ./Dockerfile --pull -t built-image-name .
    - docker tag built-image-name "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - docker push "$CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - echo $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
    - echo "Deploying on CapRover..."
    - docker run caprover/cli-caprover:v2.1.1 caprover deploy --caproverUrl $CAPROVER_URL --caproverPassword $CAPROVER_PASSWORD --caproverApp $CAPROVER_APP --imageName $CONTAINER_FULL_IMAGE_NAME_WITH_TAG
  only:
    - master
```

这相当直观。**最好的部分是：你不必对这个文件做任何更改！** 无论仓库使用什么语言，也无论部署到哪里，这个文件都一样。

这个文件中唯一不同的 3 个值，就是你在上一步设置的 3 个 `CAPROVER_***` 值。


把这个文件 commit 并 push 到 GitLab 仓库。到现在，你的 GitLab 仓库至少应有这 3 个文件
```bash
index.php
Dockerfile
.gitlab-ci.yml
```

稍等片刻，直到构建完成并自动部署。几分钟后，你就可以在 CapRover 上看到已部署的应用。

#### 关于对私有 registry 使用 `--imageName` 的说明

如果运行 `caprover deploy --imageName` 时遇到下面的错误，你可能需要让 Captain 实例对 registry 进行认证。本地已登录并不意味着 CapRover 能访问该镜像。

```
Deploy failed!
Error: (HTTP code 404) unexpected - pull access denied for user_name/repo_name, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```

**在 CapRover 上登录私有 Docker 仓库**：

- 打开 CLUSTER
- 点击 ADD REMOTE REGISTRY
- 输入数据并保存 registry
- 现在你可以对私有镜像 registry 使用 `caprover deploy --imageName`。


#### App Tokens

使用 CI/CD 时，更理想的做法通常是避免保存密码。你可以改为创建应用专用 token，用于每个应用的部署。

```
caprover deploy --appToken <YOUR_APP_TOKEN_HERE> --caproverUrl https://captain.domain.com --imageName YOUR_IMAGE_NAME --appName YOUR_APP_NAME
```

通常把 token 保存在环境变量中更安全，CLI 会从 `CAPROVER_APP_TOKEN` 变量加载它。

这个功能从 CapRover 1.10 后端和 CapRover CLI 2.2.0 开始可用。



#### 替代方法

或者，你可以使用 webhook，而不是 `docker run caprover/cli-caprover:v2.1.1 caprover deploy....`。这种方法更复杂一些。

下面**不是一个可工作的示例**。它只是提示 webhook 方法需要哪些步骤。

```bash
    - echo "Deploying on CapRover..."
    - export DEPLOY_BRANCH=deploy-caprover
    - cd ~
    - git clone your-repo
    - cd your-repo
    - git checkout $DEPLOY_BRANCH || git checkout -b $DEPLOY_BRANCH
    - git rm -rf .
    - git clean -fdx .
    - echo "{\"schemaVersion\":2,\"imageName\":\"$CONTAINER_FULL_IMAGE_NAME_WITH_TAG\"}" > captain-definition
    - git add .
    - git commit -m "Deploy $CONTAINER_FULL_IMAGE_NAME_WITH_TAG"
    - git push --set-upstream origin $DEPLOY_BRANCH
    - curl -X POST https://captain.rootdomain.com/your-webhook
```
