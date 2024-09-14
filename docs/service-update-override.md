---
id: service-update-override
title: Service Update Override
sidebar_label: Service Update Override
---

**Available as of v1.8.0**

Although [pre-deploy script](pre-deploy-script.md) provides a great power for customization of the service, sometimes, it has too much power for what you need to do. 

For example, Docker allows you to define read-only volumes, or UDP only port mapping, and many other customization flags through [docker update command](https://docs.docker.com/engine/reference/commandline/service_update/). Not all of these flags are ported over to CapRover as they are rarely used. Nevertheless, there are situations where you want to use some of these flags. For these cases, you can define a service override JSON or YAML content.  

Every time you deploy a new version, or you change a configuration parameter in the app, your service goes through an update process:

1. CapRover updates the fields that are explicitly set on CapRover UI (env vars, instance count and etc). 
2. If "Service Update Override" is present, CapRover overrides the result from the previous step with the override content.
3. If "Pre-deploy script" is present, CapRover runs the pre-deploy script. 
4. The result from the previous 3 steps is then passed to the Docker API so that Docker can update the service under the hood.

## Schema

For the "Service Update Override", you can use both yaml and JSON. The schema needs to match [Service Update Object](https://docs.docker.com/engine/api/v1.40/#operation/ServiceUpdate) in Docker API. In YAML format, it'll be something like the following YAML. Note that this is just a partial example, there are many more customization parameter available.

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


## Sample Use Cases

One common use case is to limit the resource usage by a particular service. In that case, you can do something like:

```
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes:	104857600
      NanoCPUs: 2000000000
```

This will impose a limit of 2 CPUs and 100MB RAM usage on your service. You can confirm this by running
```
docker service inspect srv-captain--your-app-name --pretty
```

Another use case is when you want to customize the command:
```yaml
TaskTemplate:
  ContainerSpec:
    Command: "./mycommand.sh"
```

If your container need some CAP_ADD added to the docker service, you can go as follow:

```yaml
TaskTemplate:
  ContainerSpec:
    CapabilityAdd:
      - CAP_SYS_ADMIN
      - CAP_NET_ADMIN
```



## Revert to Default

One important note is that CapRover does NOT modify any existing flags that it doesn't control. Flags that CapRover controls are: env vars, ports, image, and a few others.

If you override a property that is not controlled by CapRover, like the CPU limit in above, even if you delete the override, the config won't be reverted. This is because it has already been set in Docker engine.

So instead of removing the override, change the override to another value, and then remove it. For example, if you want to remove the limitation on CPU and RAM:
- First, set it to a high value, for example, RAM to 50GB and CPU to 20 CPUs
- Then, you can remove the override.


Of course, alternatively, you can delete the service and create a new one.
