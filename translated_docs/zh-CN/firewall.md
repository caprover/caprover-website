---
id: firewall
title: 防火墙与端口转发
sidebar_label: 防火墙与端口转发
---

<br/>


Captain 使用：
- 80   TCP，用于常规 HTTP 连接
- 443  TCP/UDP，用于安全 HTTPS 和 HTTP/3 连接
- 3000 TCP，用于初次安装 Captain（Captain 绑定域名后可以封锁）
- 7946 TCP/UDP，用于容器网络发现
- 4789 TCP/UDP，用于容器 Overlay 网络
- 2377 TCP/UDP，用于 Docker swarm API
- 996  TCP，用于 Docker Registry 专用的安全 HTTPS 连接

如果是 ubuntu 服务器，运行

```
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377,443/udp;
```


注意，为了更安全的安装，你可以只向公网开放 80/443/3000，其余端口只在集群中使用，对集群中的其他节点开放即可。
如果你只有一个实例，只需运行：

```
ufw allow 80,443,3000
```


另外，如果你使用端口映射来允许外部连接，例如从笔记本连接到 Captain 上的 MySQL 实例，也需要把对应端口加入放行列表。


注意：
Docker 会绕过 ufw 处理已映射端口。如果你为 CapRover 下部署的任何应用手动添加了映射端口，ufw 不一定会封锁这些端口。见[这里的相关信息](
https://askubuntu.com/questions/652556/uncomplicated-firewall-ufw-is-not-blocking-anything-when-using-docker)
