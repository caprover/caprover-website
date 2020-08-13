---
id: service-update-override
title: Service Update Override
sidebar_label: Service Update Override
---

**Available as of v1.8.0**

Although [pre-deploy script](pre-deploy-script.md) provides a great power for customization of the service, sometimes, it has too much power for what you need to do. 

For example, Docker allows you to define read-only volumes, or UDP only port mapping, and many other customization flags through [docker update command](https://docs.docker.com/engine/reference/commandline/service_update/). Not all of these flags are ported over to CapRover as they are rarely used. Nevertheless, there are situations where you want to use some of these flags. For these cases, you can define a service override JSON or YAML content.  

Every time you deploy a new version, or you change a configuration parameter in the app, your service goes through an update process:

```
1- CapRover updates the fields that are explicitly set on CapRover UI (env vars, instance count and etc). 
2- If "Service Update Override" is present, CapRover overrides the result from the previous step with the override content.
3- If "Pre-deploy script" is present, CapRover runs the pre-deploy script. 
4- The result from the previous 3 steps is then passed to the Docker API so that Docker can update the service under the hood.
```


## Schema

For the "Service Update Override", you can use both yaml and JSON. The schema needs to match [Service Update Object](https://docs.docker.com/engine/api/v1.30/#operation/ServiceUpdate) in Docker API. In YAML format, it'll be something like the following YAML. Note that this is just a partial example, there are many more customization parameter available.

```
TaskTemplate:
  ContainerSpec:
    Image: busybox
    Args:
    - top
  Resources:
    Limits: {}
    Reservations: {}
  RestartPolicy:
    Condition: any
    MaxAttempts: 0
  Placement: {}
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
RollbackConfig:
  Parallelism: 1
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
EndpointSpec:
  Mode: vip
```


## Sample Use Case

One common use case is to limit the resource usage by a particular service. In that case, you can do something like:

```
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes:	104857600
      NanoCPUs: 2000000000
```

This will impose a limit of 2 CPUs and 100MB RAM usage on your service.