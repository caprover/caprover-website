---
id: index
title: 服务器管理
slug: /server
---

<span id="source-server-settings"></span>

## 服务器设置

用dashboard **设置** 区域来管理根域、账户密码、更新和 CapRover 备份。 在更改其域或升级前备份服务器 。

### 根域

在设置根域之前,在服务器上标注通配符DNS记录和dashboard主机名. 更改它会影响生成的app和dashboard主机名;检查DNS,并在更改后更新HTTPS证书. 如果您使用自托管 registry,在更改域前删除或移动该注册。 见 [DNS 和域数](../domains/index.md).

### 账户和回收

安装后更改初始密码,用HTTPS保护dashboard,安全存储回收证书. 审查 [安全访问](index.md) 和 [备份恢复( R)](backup/index.md) 生产使用前。

<span id="source-server-security"></span>

## 安全访问

- 更改初始dashboard密码,启用用于dashboard的HTTPS,并使用主机和供应商防火墙限制访问端口和SSH.
- 将 Swarm 端口限制为信任的集群节点; 参见 [多节点设置](../scaling/multi-node.md).
- 不断更新Docker和CapRover.

- 将部署令牌,注册证书,环境变量,备份档案,和SSH密钥视为秘密.
- 使用单独的证书进行自动化,在曝光时旋转,并审查 [CapRover Pro (超级英雄)](index.md) 如果您使用 Pro 选项,则使用 2 因素选项。
- 一个在管理器上拥有Docker socket访问权限的人实际上拥有广泛的主机控制;故意授予 shell和dashboard访问权限.

分别备份 CapRover 配置和应用数据并练习恢复. 关于准入问题,见 [诊断](../troubleshooting/diagnostics.md).

### 恢复被遗忘的dashboard密码

- 使用dashboard正常的密码更改流程,当你仍然可以签入.
- 如果您已失去访问权限, 但保留 shell 访问权限给管理器, 当前 [认证器](https://github.com/caprover/caprover/blob/master/src/user/Authenticator.ts) 倒计时 `DEFAULT_PASSWORD` 仅当没有保存的密码散列存在时。
- 此程序会短暂停止 CapRover 并更改其保存的配置 。
- 拥有最近的备份, 只运行在您的服务器上 :

1. 确保 `jq` 已安装,记录当前 `captain-captain` 服务镜像,并备份 `/captain/data/config-captain.json` 在服务器外。
2. 在服务运行时准备替换配置 :

   ```bash
   sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-password-reset
   sudo jq 'del(.hashedPassword)' /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
   sudo jq empty /captain/data/config-captain.json.new
   ```

3. 选择至少八个字符的临时密码 。 停止 CapRover, 安装准备的文件, 设置临时密码, 然后重新启动服务 :

   ```bash
   read -rsp 'Temporary password: ' CAPROVER_TEMP_PASSWORD; echo
   sudo docker service scale captain-captain=0
   sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
   sudo docker service update --env-add "DEFAULT_PASSWORD=$CAPROVER_TEMP_PASSWORD" captain-captain
   sudo docker service scale captain-captain=1
   unset CAPROVER_TEMP_PASSWORD
   ```

4. 在 HTTPS 上签名, 在设置中更改临时密码, 并验证新登录 。 从 Docker 服务中删除临时环境变量 `sudo docker service update --env-rm DEFAULT_PASSWORD captain-captain`,然后再次验证登录。 该临时值可能在Docker服务检查中可见,直到移除. 保留原备份配置直到恢复成功.

如果双因子认证也阻碍访问,请参见 [检察官办公室](index.md)这些是单独的回收步骤。

<span id="source-server-pro"></span>

## CapRover Pro

- CapRover Pro增加了通过dashboard配置的订阅后功能,并配有Pro API密钥.
- 可用的控制包括双因子认证,登录提醒,构建成功和构建失败提醒,以及电子邮件或webhook动作.
- 请检查date=中的日期值 (帮助)

- 在依赖之前设置并测试警戒目的地.
- 安全存储您的Pro密钥。
- 当启用两要素认证时,带有您dashboard密码的交互式CLI登录也要求当前一次性代码:

```bash
CAPROVER_OTP_TOKEN=123456 caprover login
```

- 替换 `123456` 带有当前代码。
- CLI发送 `CAPROVER_OTP_TOKEN` 在基于密码的认证过程中,包括由 `caprover deploy` 当它需要一个新的会话。
- 对于应用扫描的CI,请使用 [应用程序部署符](../deployments/ci-cd/index.md) 而不是dashboard密码和时间敏感的检察官办公室。
- 如果您无法访问您的一次性密码, 有 shell 访问管理器的管理员可以在 CapRover 容器内运行回收脚本 :

```bash
docker exec -it "$(docker ps --filter name=captain-captain -q | head -n 1)" npm run disable-otp
```

首先验证目标容器, 只为您自己实例使用, 然后再次签名并配置两个要素认证 。 见 [Pro 排除故障](../troubleshooting/diagnostics.md).

**提议电子邮件提醒 :** 如果您需要不同收件箱中的提醒, 请检查当前提醒发送者( 历史 ) `alerts@mail.pro.caprover.com`)并使用电子邮件过滤/转发规则。 在依赖它之前先测试转发.

<span id="source-server-themes"></span>

## Dashboard 主题

- dashboard **主题** 设置允许您选择内置主题或创建自定义主题。
- 自定义主题内容是一个传递给Ant Design的JavaScript对象,而不是JSON文本.
- 编辑提供 `isDarkMode`, `darkAlgorithm`,以及 `defaultAlgorithm`:

```javascript
{
  algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
  token: {
    colorPrimary: '#2769c5',
    colorBgBase: isDarkMode ? '#101010' : '#ffffff',
    borderRadius: 6,
    fontSize: 14
  }
}
```

- 这个 **头部嵌入** 字段可以加载字体或其他头标签,例如 `<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />`.
- 这个 **额外配置** 字段接受 JavaScript 对象, 如 `{ siderTheme: 'dark' }` 暗边栏。
- 在给dashboard头添加脚本之前审查代码.
- 保存您的工作, 选择主题, 并检查可读性, 无论是光模式还是暗模式 。
- 您可以编辑或删除自定义主题;内置主题受到保护.

主题只影响dashboard的外观;应用程序的造型属于应用程序本身. 这个 [内置主题定义](https://github.com/caprover/caprover/tree/master/template/themes) 和 [蚂蚁设计主题标志](https://ant.design/docs/react/customize-theme) 提供更多实例。
