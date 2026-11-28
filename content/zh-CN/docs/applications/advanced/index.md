---
id: index
title: 高级应用配置
slug: /applications/advanced
---

<span id="source-applications-advanced-service-update-override"></span>

## Service Update Override

- **Service Update Override** 字段允许在 CapRover 配置或部署应用时，将 JSON 或 YAML 配置合并到 Docker service update 请求中。
- 适用于 dashboard 没有提供的 Docker service 选项。
- 尽量从最小的 override 配置开始：

```yaml
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 104857600
```

- 此示例将服务内存限制为 100 MiB。
- 使用 `docker service inspect SERVICE_NAME` 检查配置结果；实际服务名可以通过 `docker service ls` 获取。
- 保留限制前，应先用接近生产环境的负载进行测试。

- 应用顺序依次是 CapRover 常规设置、Service Update Override，然后是可选的 pre-deploy 函数。
- Override 可能覆盖 CapRover 自动设置的值。
- 传入的字段必须符合 Docker service update API 的格式。
- 删除 override 后，CapRover 不一定会重置它本身不管理的 Docker 字段；撤销配置时请显式恢复原值。

- 保存一份可正常工作的 service 配置。
- 错误或冲突的 override 可能导致部署失败。
- 具体字段格式请参考当前 Docker 版本对应的 [Docker service update API 文档](https://docs.docker.com/reference/api/engine/)。

<span id="source-applications-advanced-pre-deploy-function"></span>

## Pre-Deploy Function

- **Pre-Deploy Function** 是在 CapRover 进程中执行的一段 JavaScript，运行时间在应用的 Docker service 更新之前。
- 它可以读取已保存的应用对象，并修改 Docker service update 对象。
- 它在常规应用配置和 Service Update Override 生效后执行。

```javascript
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
  return Promise.resolve(dockerUpdateObject);
};
```

- 函数必须返回 service update 对象，也可以通过 Promise 返回。
- 每次部署或更新应用配置时都会再次执行。
- 用于重要服务前，先在测试应用中验证，并保存函数和服务配置的可用版本。

- 这段代码以 CapRover 进程的权限执行。
- 它可能造成 service update 失败，也可能读取敏感信息，因此需要严格控制编辑权限。
- 对于固定的 service 字段，优先使用 [Service Update Override](index.md)。
- 如果更新在调用 Docker 前失败，请检查 `docker service logs captain-captain`。
