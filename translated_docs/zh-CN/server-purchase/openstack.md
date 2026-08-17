---
id: openstack
title: 在 OpenStack 上安装 CapRover
sidebar_label: OpenStack
---

## 为什么选择 OpenStack？

OpenStack 是专有基础设施即服务（IaaS）云标准最流行的替代方案。
无论是 AWS 和 Azure 这样的大型云提供商，还是 Hetzner 这样的较小提供商，都有各自不同的 API、
配置和资源部署命名约定。
OpenStack 让你可以在任何实现了 OpenStack 标准的云上以相同方式部署（甚至可以自己搭建），
从而摆脱厂商锁定。

## 设置 OpenStack 提供商

许多云提供商支持 OpenStack，包括 Infomaniak、VEXXHOST、OVHcloud、SharkTech 等。

在我见过的提供商中，Infomaniak 的[文档](https://docs.infomaniak.cloud/)最好。

你应按照提供商的说明获取 cloud.yaml 文件，以便把 OpenStack CLI
连接到云项目。

下面是 Infomaniak 的简要步骤。
更多细节和截图见他们的[文档](https://docs.infomaniak.cloud/documentation/00.getting-started/01.Create_new_project/)。
其他提供商的步骤应类似。

1.  在公共云控制台中创建一个新项目。项目名可以类似 `caprover-prod`。
2.  按提示为 OpenStack 用户生成并设置密码。
3.  打开项目的 “Manage users”。点击唯一用户（以 PCU-... 开头）旁边的下拉菜单，下载
    clouds.yaml 文件。
4.  把 `clouds.yaml` 移到 [OpenStack 客户端能找到的位置](https://docs.openstack.org/python-openstackclient/latest/configuration/index.html)，也就是
    主目录中的 `.config/openstack/clouds.yaml`。
    如果你之前已经设置过这个文件，把配置复制并追加到现有文件中。
5.  打开 `clouds.yaml` 文件，把云名称从 `PCP-...` 改成更易读的名称，例如
    `infomaniak-prod`。这样当你增加更多环境，甚至其他 OpenStack
    提供商时，可以继续往这个文件里添加。
6.  同时把第 2 步生成的密码写入文件。

## 安装 OpenStack CLI 并验证连接
1.  安装 OpenStack 命令行客户端。
    [官方 OpenStack 说明](https://docs.openstack.org/newton/user-guide/common/cli-install-openstack-command-line-clients.html)
    会让你通过 `pip` 安装客户端，但使用 [pipx](https://pipx.pypa.io/stable/)
    更干净，可以避免污染全局 Python 包空间：
    ```
    pip install pipx
    pipx install python-openstackclient
    pipx inject python-openstackclient python-heatclient
    ```
2.  用下面的命令验证连接：
    ```
    openstack --os-cloud mycloud project list
    ```
    （注意：在这条以及后续命令中，把 `mycloud` 替换成你在 clouds.yaml 中实际设置的名称，
    例如 `vexxhost-dev` 或 `infomaniak-prod`）。
    这应显示你的默认项目名称。

## 部署 OpenStack Heat 模板文件

1.  你需要生成一把密钥，以便在需要时 SSH 进入 CapRover 服务器。
    你可以创建文件夹 `~/.ssh/openstack`，或把密钥存放在任何你喜欢的位置。
    ```
    openstack --os-cloud mycloud keypair create caprover > ~/.ssh/openstack/mycloud.priv
    chmod 600 ~/.ssh/openstack/mycloud.priv
    ```
2.  许多 OpenStack 提供商会提供一组默认 VM 镜像。
    用下面的命令检查可用镜像
    ```
    openstack --os-cloud mycloud image list
    ```
    建议使用最新版本的 Ubuntu LTS。
    你也可以按
    [这里](https://docs.openstack.org/heat/latest/getting_started/create_a_stack.html#preparing-to-create-a-stack) 的说明上传自己的镜像。
3.  用下面的命令检查可用 flavors
    ```
    openstack --os-cloud mycloud flavor list
    ```
3.  用下面的命令检查可用网络
    ```
    openstack --os-cloud mycloud network list
    ```
4.  最后，把所有部分组合起来部署 CapRover。确保把占位值替换成你自己的值。
    ```
    openstack --os-cloud mycloud stack create -t https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/openstack/single-instance.yml --parameter image_id=<Ubuntu image ID> --parameter instance_type=<flavor> --parameter network=<network> caprover
    ```
    例如，下面这条在 Infomaniak 上可用：
    ```
    openstack --os-cloud infomaniak-dev stack create -t https://raw.githubusercontent.com/caprover/caprover/master/se
tup/openstack/single-instance.yml --parameter image_id="Ubuntu 22.04 LTS Jammy Jellyfish" --parameter instance_type=a1-ram2-disk20-perf1 --parameter network=ext-net1 caprover
    ```

## 验证部署
1.  登录 OpenStack 控制台 Web UI。
2.  打开 Instances。你应看到实例 `caprover-caprover_manager-...`。复制它的 IP 地址。
3.  你应能在浏览器中通过 `<IP address>:3000` 看到 CapRover 控制台。
    从这时起，你应能按
    [开始使用](https://caprover.com/docs/get-started.html) 中的说明完成 CapRover 设置
4.  你也可以用下面的命令 SSH 进入实例：
    ```
    ssh -i ~/.ssh/openstack/mycloud-prod.priv -o StrictHostKeyChecking=accept-new ubuntu@<CapRover manager IP>
    ```
    进入后，你可以用命令
    `sudo less /var/log/cloud-init-output.log` 查看 Heat 模板安装过程的输出。
