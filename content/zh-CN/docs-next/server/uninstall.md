---
id: uninstall
title: 卸载 CapRover
slug: /server/uninstall
---

删除 CapRover 之前,导出 a [CapRover 备份](backup/index.md) 并为每个应用程序的数据分别备份。 记录 DNS 和镜像注册依赖性 。 删除 CapRover 或其 Docker 资源可以使应用程序无法使用 。

CapRover 没有一个可以安全决定您想要保存的应用程序数据或其他 Swarm 服务的 单指令 。 退职a **专用** CapRover 主机 :

1. 通过dashboard删除或移动每个应用程序,记录其实际的Docker服务名称并保存您需要的任何卷或绑定挂载. 确认没有客户端仍然依赖于其域或已公布的端口.
2. 运行 `docker service ls` 并确定CapRover核心服务`captain-captain`, `captain-nginx`, `captain-certbot`,以及任何可选registry)。 删除 **只有你打算退休的服务** 与 `docker service rm SERVICE_NAME`不使用 `docker service rm $(docker service ls -q)` 在共享的 Swarm 上;它也会删除无关的应用程序。
3. 在确认您有经过测试的外部备份后, 请审查 `/captain` 和产出 `docker volume ls`。只删除您明确选择销毁数据的目录和卷。 即使没有容器运行,某一卷仍然可以包含有价值的数据。
4. 删除 DNS 记录,转发端口,防火墙规则不再需要. 离开Swarm `docker swarm leave --force` **只有在** 这个主机正在从SWARM退役 并且没有其它服务依赖于它。 在集群中先从另一个节点校验 。

- 保存备份和注册镜像,直到更换系统通过回收检查。
- 避开毯子 `docker system prune --all`:它可以删除其他应用程序或回滚所需的镜像.
