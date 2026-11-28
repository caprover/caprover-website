---
id: advanced-certbot
title: 高级 Certbot / ACME 配置
slug: /domains/advanced-certbot
---

Certbot 默认通过 HTTP-01 webroot challenge 验证域名。请确保端口 80 可访问，并且 hostname 指向 CapRover。只有标准流程不满足需求时才需要调整。

- CapRover 可以从 `/captain/data/config-override.json` 读取 `certbotCertCommandRules` 和 `certbotImageName`。
- DNS-01 需要兼容的 Certbot plugin 镜像，并确保运行中的容器能够读取所需凭据。
- 例如使用 Cloudflare DNS plugin 时，将凭据文件放在 `/captain/data/letsencrypt/etc/captain-files/` 下并限制权限，然后配置镜像和命令：

```json
{
  "certbotImageName": "YOUR_COMPATIBLE_CERTBOT_IMAGE:TAG",
  "certbotCertCommandRules": [
    {
      "domain": "*",
      "command": "certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/captain-files/mycreds.ini -d ${domainName}"
    }
  ]
}
```

- 替换为包含 DNS plugin、且能够按 CapRover 预期运行的镜像；默认镜像没有预装所有第三方 plugin。`${domainName}` 会由 CapRover 展开。
- `"domain": "*"` 规则会匹配**所有**证书请求，但示例命令只申请 CapRover 传入的精确 hostname。
- 如需通配符证书，应另外规划基础域名和通配符域名的签发请求。
- 匹配根域名的规则也可能匹配子域名。配置 wildcard 前请检查[规则匹配实现](https://github.com/caprover/caprover/blob/master/src/user/system/CertbotManager.ts)。
- 先在测试域名上验证命令。具体 plugin 参数和 DNS 凭据格式取决于 DNS 服务商。
- 如果 CapRover 的域名验证逻辑不适合 DNS-only 环境，应单独评估 `skipVerifyingDomains`，并自行确认域名所有权。

- 修改生产服务器前，保存可用的 override 和证书配置，按照 plugin 文档检查命令，并在测试域名上完成签发验证。
- 使用 `docker service update captain-captain --force` 重启 CapRover service，使配置生效。
- 使用其他 ACME 服务器时，可能需要在 `/captain/data/letsencrypt/etc/` 下添加 `cli.ini`，设置服务器 URL 和 external-account-binding 凭据。请参考 ACME 服务商要求并检查 DNS CAA 记录。
- 不要将 DNS API 凭据提交到代码仓库。
