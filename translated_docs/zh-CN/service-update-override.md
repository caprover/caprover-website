---
id: service-update-override
title: 服务更新覆盖
sidebar_label: 服务更新覆盖
---

**从 v1.8.0 起可用**

虽然 [pre-deploy script](pre-deploy-script.md) 提供了很强的服务自定义能力，但有时它对你要做的事情来说太过强大。

例如，Docker 允许你定义只读卷、仅 UDP 的端口映射，以及许多其他通过 [docker update command](https://docs.docker.com/engine/reference/commandline/service_update/) 提供的自定义标志。这些标志并没有全部移植到 CapRover，因为它们很少使用。不过，有些情况下你确实想使用其中一些标志。这时，你可以定义一段 service override JSON 或 YAML 内容。

每次部署新版本，或更改应用中的配置参数时，服务都会经过一次更新过程：

1. CapRover 更新在 CapRover UI 上明确设置的字段（环境变量、实例数等）。
2. 如果存在 “Service Update Override”，CapRover 会用覆盖内容覆盖上一步的结果。
3. 如果存在 “Pre-deploy script”，CapRover 会运行 pre-deploy script。
4. 前 3 步的结果随后会传给 Docker API，以便 Docker 在底层更新服务。

## Schema

对于 “Service Update Override”，你可以使用 yaml 和 JSON。schema 需要匹配 Docker API 中的 [Service Update Object](https://docs.docker.com/reference/api/engine/version/v1.43/#tag/Service/operation/ServiceUpdate)。在 YAML 格式中，它看起来会像下面这样。注意这只是一个部分示例，还有许多其他自定义参数可用。

```yaml
TaskTemplate:
  ContainerSpec:
    Labels:
      some.label: some.value
    Image: busybox
    Command:
      - ./mycommand.sh
    Hostname: my.domain.com
    CapabilityAdd:
      - CAP_NET_ADMIN
    DNSConfig:
      Nameservers:
         - 8.8.8.8 
         - 8.8.4.4 
    Mounts:
      - Type: bind
        Source: /host/directory
        Target: /some/path/in/container
        ReadOnly: true
    Args:
      - top
  Resources:
    Limits:
      MemoryBytes: 104857600
      NanoCPUs: 2000000000
    Reservations:
      MemoryBytes: 104857600
      NanoCPUs: 2000000000
  RestartPolicy:
    Condition: any
    MaxAttempts: 0
  Placement:
    Constraints:
      - node.id==2ivku8v2gvtg4
  Networks:
    - Target: captain-overlay-network
  LogDriver:
    Name: json-file
    Options:
      max-size: 512m
  ForceUpdate: 0
Mode:
  Replicated:
    Replicas: 1
UpdateConfig:
  Parallelism: 2
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
RollbackConfig:
  Parallelism: 1
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
EndpointSpec:
  Mode: vip
  Ports:
    - Name: something
      Protocol: tcp
      TargetPort: 80
      PublishedPort: 8080
      PublishMode: host
```


## 示例用例

一个常见用例是限制某个服务的资源使用。这时可以这样做：

```
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes:	104857600
      NanoCPUs: 2000000000
```

这会给你的服务施加 2 个 CPU 和 100MB RAM 的限制。你可以通过运行下面的命令确认：
```
docker service inspect srv-captain--your-app-name --pretty
```

另一个用例是自定义命令：
```yaml
TaskTemplate:
  ContainerSpec:
    Command: "./mycommand.sh"
```

如果你的容器需要给 docker service 添加一些 CAP_ADD，可以这样做：

```yaml
TaskTemplate:
  ContainerSpec:
    CapabilityAdd:
      - CAP_SYS_ADMIN
      - CAP_NET_ADMIN
```



## 恢复默认值

一个重要说明是：CapRover 不会修改它不控制的现有标志。CapRover 控制的标志包括：环境变量、端口、镜像，以及其他少数几个。

如果你覆盖了一个不受 CapRover 控制的属性，例如上面的 CPU 限制，即使删除覆盖，配置也不会恢复。因为该配置已经设置到 Docker engine 中。

因此，不要直接删除覆盖，而是先把覆盖改成另一个值，然后再删除它。例如，如果你想去掉 CPU 和 RAM 限制：
- 先把它设成一个很高的值，例如 RAM 设为 50GB，CPU 设为 20 个 CPU
- 然后，你可以删除覆盖。


当然，你也可以删除服务并创建一个新服务。
