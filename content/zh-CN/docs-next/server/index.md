---
id: index
title: 服务器管理
slug: /server
---

<span id="source-server-settings"></span>

## 服务器设置

打开 **Settings** 管理根域名和账户密码、[升级 CapRover](upgrade.md)或[下载备份](backup/index.md)。

### 根域名

设置根域名前，先确认通配符 DNS 记录和 dashboard 域名都指向当前服务器。修改根域名会影响应用及 dashboard 自动生成的域名；修改后应检查 DNS 并更新 HTTPS 证书。如果启用了自托管 registry，应先停止使用或迁移它，再修改根域名。参阅 [DNS 与域名](../domains/index.md)。

### 账户与恢复

安装完成后立即修改初始密码，使用 HTTPS 保护 dashboard，并安全保存恢复凭据。生产环境上线前请阅读[安全与访问控制](index.md)及[备份与恢复](backup/index.md)。

<span id="source-server-security"></span>

## 安全与访问控制

- 修改 dashboard 初始密码，启用 HTTPS，并通过宿主机及云服务商防火墙限制端口和 SSH 访问。
- Swarm 端口只允许可信集群节点访问；参阅[多节点部署](../scaling/multi-node.md)。
- 及时更新 Docker 和 CapRover。

- 部署 token、registry 凭据、环境变量、备份文件和 SSH 密钥都应作为敏感信息保护。
- 为自动化任务使用独立凭据，一旦泄露立即轮换。如果使用 Pro，可查看 [CapRover Pro](index.md) 的双重身份验证选项。
- 在 manager 节点拥有 Docker socket 访问权限的用户，实际上可以控制宿主机的大部分资源。谨慎授予 shell 和 dashboard 权限。

分别备份 CapRover 配置和应用数据，并定期测试恢复。如果遇到访问故障，参阅[诊断工具](../troubleshooting/diagnostics.md)。

### 忘记 dashboard 密码时如何恢复

- 如果还能登录，请直接使用 dashboard 的常规密码修改功能。
- 如果已无法登录，但仍能通过 shell 访问 manager 节点，当前[身份验证实现](https://github.com/caprover/caprover/blob/master/src/user/Authenticator.ts)仅在配置中不存在密码 hash 时才回退到 `DEFAULT_PASSWORD`。
- 下列步骤会短暂停止 CapRover 并修改已保存的配置。
- 请先确认有近期备份，并且只在自己管理的服务器上执行：

1. 确保安装了 `jq`，记录 `captain-captain` service 当前使用的镜像，并在服务器之外备份 `/captain/data/config-captain.json`。
2. 保持服务运行，先生成新的配置文件：

   ```bash
   sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-password-reset
   sudo jq 'del(.hashedPassword)' /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
   sudo jq empty /captain/data/config-captain.json.new
   ```

3. 选择至少八个字符的临时密码，停止 CapRover，替换配置，设置临时密码后重新启动：

   ```bash
   read -rsp 'Temporary password: ' CAPROVER_TEMP_PASSWORD; echo
   sudo docker service scale captain-captain=0
   sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
   sudo docker service update --env-add "DEFAULT_PASSWORD=$CAPROVER_TEMP_PASSWORD" captain-captain
   sudo docker service scale captain-captain=1
   unset CAPROVER_TEMP_PASSWORD
   ```

4. 通过 HTTPS 登录，在 Settings 中修改临时密码并确认新密码有效。然后运行 `sudo docker service update --env-rm DEFAULT_PASSWORD captain-captain`，从 Docker service 中移除临时环境变量，并再次检查登录。删除前，临时密码可能通过 Docker service inspect 被看到。恢复成功前请保留原始配置备份。

如果同时无法通过双重身份验证，请查看 [Pro OTP 恢复](index.md)。这是独立的恢复流程。

<span id="source-server-pro"></span>

## CapRover Pro

- CapRover Pro 提供订阅功能，需要在 dashboard 中配置 Pro API key。
- 可用功能包括双重身份验证、登录告警、构建成功或失败通知，以及邮件或 webhook 动作。
- 实际功能以 dashboard 的 Pro 设置和当前订阅为准。

- 正式依赖告警前，先配置并测试通知目标。
- 安全保存 Pro key。
- 启用双重身份验证后，使用 dashboard 密码进行交互式 CLI 登录时，还需要当前的一次性验证码：

```bash
CAPROVER_OTP_TOKEN=123456 caprover login
```

- 将 `123456` 替换为当前有效的验证码。
- CLI 在通过密码认证时发送 `CAPROVER_OTP_TOKEN`，包括 `caprover deploy` 需要重新登录时。
- CI 部署单个应用时，建议使用[应用部署 token](../deployments/ci-cd/index.md)，避免在 CI 中保存 dashboard 密码和需要频繁更新的 OTP。
- 如果丢失了 OTP，拥有 manager 节点 shell 权限的管理员可以在 CapRover 容器内运行恢复命令：

```bash
docker exec -it "$(docker ps --filter name=captain-captain -q | head -n 1)" npm run disable-otp
```

执行前先确认选中的容器正确，并且仅对自己管理的实例使用。恢复登录后应重新配置双重身份验证。参阅 [Pro 故障排查](../troubleshooting/diagnostics.md)。

**Pro 邮件告警：**如果需要将告警转发到其他邮箱，先确认当前告警的发件地址（历史上使用 `alerts@mail.pro.caprover.com`），然后配置邮件过滤或转发规则。正式使用前先测试。

<span id="source-server-themes"></span>

## Dashboard 主题

dashboard 的 **Themes** 设置允许选择内置主题或创建自定义主题。

- 自定义主题使用传给 Ant Design 的 JavaScript 对象，而不是 JSON 文本。
- 编辑器提供 `isDarkMode`、`darkAlgorithm` 和 `defaultAlgorithm`：

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

- **head embed** 字段可添加字体或其他 head 内容，例如 `<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />`。
- **extra configuration** 字段接受 JavaScript 对象，例如 `{ siderTheme: 'dark' }`，用于配置深色侧边栏。
- 在 dashboard 的 head 中嵌入脚本前，务必检查代码的来源和安全性。
- 保存主题并应用后，检查亮色和暗色模式下的可读性。
- 自定义主题可以编辑或删除，内置主题受保护。

主题只影响 dashboard 外观，不会修改应用自身的 UI。更多示例参见[内置主题定义](https://github.com/caprover/caprover/tree/master/template/themes)和 [Ant Design 主题 token](https://ant.design/docs/react/customize-theme)。
