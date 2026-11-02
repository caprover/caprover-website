---
id: shared-storage
title: 共享/ 外部存储
slug: /data-persistence/shared-storage
---

- Docker卷默认为局部到节点.
- 对于跨节点访问,使用在每个合格节点上挂载的共享存储,或者在外部存储上传.
- CapRover 不提供或复制共享存储.
- 验证权限, 失败恢复, 以及同时写入的行为 。 单凭一个共享的卷子并不能使一个数据库对多个复制品安全.
- 单独备份共享数据 。
