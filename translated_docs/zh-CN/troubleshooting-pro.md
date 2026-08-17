---
id: troubleshooting-pro
title: 排查 CapRover Pro
sidebar_label: 排查问题（Pro）
---

<br/>

这一节只适用于 CapRover Pro 订阅者（付费计划）。你可以订阅付费计划，并获得构建状态通知、登录提醒和双因素认证等额外功能。

## 重置 OTP（双因素认证）

在少数情况下，你可能需要重置双因素认证，例如：

- 当 https://pro.caprover.com 不可用，你无法访问实例时
- 当你丢失了 authenticator 应用的访问权限时

这时，你只需要清除 pro 配置，并临时把服务器降级为非付费版本。可以通过删除 `/captain/data/config-captain.json` 中的 `pro` 内容来完成。

下面的辅助脚本会完成这件事：

```bash
docker service scale captain-captain=0 && \
docker run -it --rm -v /captain:/captain  caprover/caprover /bin/sh -c "wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/clear-pro-config.js ; node clear-pro-config.js ;" && \
docker service scale captain-captain=1 && \
echo "OKAY"

```

**更新：**

从 v1.12.0 开始，你可以运行下面的脚本：

```bash
docker exec -it $(docker ps --filter name=captain-captain -q) npm run disable-otp
```

## 在启用 OTP 时部署

启用 OTP 后，你不能使用常规的 `caprover deploy` 部署，因为它需要 2FA token（`enter OTP token as well`）。你应改用 App Tokens：

```bash
caprover deploy --caproverUrl https://captain.domain.com --appToken 123456123456123456 --appName my-app -b main
```

你可以在 Deployment 标签启用 App Token。或者，你也可以使用下面的格式（不推荐）：

```bash
CAPROVER_OTP_TOKEN=123456; caprover login

## or

CAPROVER_OTP_TOKEN=123456; caprover deploy
```

## 为提醒设置特定邮箱

更改通知邮箱目前不是内置功能。不过，选择 Google 作为认证提供商的原因之一，就是你可以在 Gmail 中轻松设置过滤器，并把特定邮件转发到另一个邮箱。

搜索 `from: alerts@mail.pro.caprover.com` 并创建一个过滤器，然后把结果转发到另一个邮箱。

![gmail-instruction-1](/img/docs/gmail-1.png)
![gmail-instruction-2](/img/docs/gmail-2.png)

## 邮件支持

我们的付费 Pro 计划包含 24 小时 SLA 邮件支持。你可以发送邮件到 `pro.support at/caprover/dot/com` 获取支持。请确保使用购买时使用的同一邮箱。
