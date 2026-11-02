---
id: index
title: 高级应用程序配置
slug: /applications/advanced
---

<span id="source-applications-advanced-service-update-override"></span>

## Service Update Override

- 这个 **Service Update Override** 字段将 JSON 或 YAML 设置合并到 CapRover 配置或部署应用程序时准备的 Docker 服务更新中。
- 对Docker服务选项有用,因为dashboard不会曝光.
- 从最小可能的覆盖开始 :

```yaml
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 104857600
```

- 这个例子将服务限制在100 MiB的内存.
- 以 `docker service inspect SERVICE_NAME`; 从 `docker service ls`.
- 以现实的载荷进行测试,然后保持极限.

- 更新命令是CapRover的正常设置,然后是服务覆盖,然后是可选的部署前功能.
- 覆盖可以替换所选择的 CapRover 设置 。
- 值必须匹配Docker的服务更新 API.
- 删除一个覆盖并不一定清除 CapRover 本身不管理的 Docker 字段; 在撤销此更改时明确重置该值 。

- 保留工作服务设置的副本。
- 无效或自相矛盾的覆盖可以阻断部署.
- 见 [Docker 服务更新 API](https://docs.docker.com/reference/api/engine/) 用于运行您的服务器的 Docker 版本所使用的计划。

<span id="source-applications-advanced-pre-deploy-function"></span>

## 部署前函数

- A **部署前函数** 是在一个应用程序的 Docker 服务更新前 CapRover 进程内执行的 JavaScript 。
- 它可以检查存储的应用对象并修改服务更新对象.
- 它在标准应用程序设置和服务更新 Override 应用之后运行.

```javascript
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
  return Promise.resolve(dockerUpdateObject);
};
```

- 该函数必须返回服务更新对象,可能通过承诺.
- 它在部署和配置更新时再次执行.
- 在将它用于重要服务之前,先对一次性应用程序进行测试,并保存功能和服务配置的工作副本。

- 此代码具有CapRover进程的特权.
- 它可以中断服务更新或访问敏感数据,从而限制谁可以编辑.
- 对于静态服务字段,偏好 [Service Update Override](index.md).
- 检查 `docker service logs captain-captain` 如果服务更新在到达Docker之前失败。
