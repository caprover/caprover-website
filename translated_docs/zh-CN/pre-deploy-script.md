---
id: pre-deploy-script
title: 部署前脚本
sidebar_label: 部署前脚本
---

<br/>
这是一个非常高级的操作，需要特别小心。否则，它可能破坏应用的部署。

这个脚本会在容器（也就是应用）因配置更改或应用部署而即将更新之前运行。在这个脚本中，你可以修改 Docker service 对象、发起 HTTP 调用，以及做几乎任何事情。脚本模板如下：
```
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
	return Promise.resolve()
		.then(function(){

		    // Do something in a Promise form

		    // In the end, return the "possibly-modified" dockerUpdateObject
		    return dockerUpdateObject;
		});
};

```

注意，`captainAppObj` 是保存在 `/captain/data/config-captain.json` 文件中的应用对象，`dockerUpdateObject` 是传给 Docker 以更新服务的 service update 对象（环境变量、镜像版本等）。这个对象遵循 [Docker 文档](https://docs.docker.com/engine/api/v1.30/#operation/ServiceUpdate)。

由于这个脚本会在 CapRover 进程中执行，你可以访问 CapRover 拥有的全部 node 依赖，见 [Caprover/caprover/package.json](https://github.com/caprover/caprover/blob/master/package.json)。例如，下面的脚本会在每次更新时，把一个映射到已部署版本的 UUID 注入到 service label：

```
var { v4: uuid } = require('uuid');

var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
	return Promise.resolve()
		.then(function(){

		    dockerUpdateObject.TaskTemplate.ContainerSpec.Labels[uuid()] =
                                                         captainAppObj.deployedVersion+ '';
		    return dockerUpdateObject;
		});
};

```

注意，这个部署前脚本，尤其是 Docker service update 对象，比较复杂。因此，强烈建议只有专家用户才使用这个部署前方法。例如，注意在这一行中，已部署版本后面加了一个空字符串：

```
dockerUpdateObject.TaskTemplate.ContainerSpec.Labels[uuid()] = captainAppObj.deployedVersion+ '';
```

去掉这个简单处理，部署应用时就会抛出错误。要查看日志，需要运行 `docker service logs captain-captain --follow`。即使 Docker 的错误也不够清晰。总之，这是一个高级功能，不建议初学者和中级用户使用。
