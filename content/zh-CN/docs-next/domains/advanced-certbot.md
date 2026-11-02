---
id: advanced-certbot
title: 高级证书/ ACME
slug: /domains/advanced-certbot
---

一般的Certbot路径使用HTTP-01网根挑战. 保持端口80可到达,主机名指向CapRover. 仅在路径无法满足您的证书要求时才更改 。

- CapRover 能读到 `certbotCertCommandRules` 和 `certbotImageName` 从 `/captain/data/config-override.json`.
- DNS-01需要一个兼容的,长期运行的 Certbot 插件图像和证书可以在该容器内读取.
- 例如,对于一个 Cloudflare DNS 插件, 将其证书文件存储在下面 `/captain/data/letsencrypt/etc/captain-files/` 然后配置图像和命令:

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

- 将图像替换为包含 DNS 插件并按 CapRover 所期望运行的插件;存储图像不包括每个第三方 DNS 插件. `${domainName}` 由CapRover扩展.
- 这个 `"domain": "*"` 规则适用于 **每个** 证书请求, 但是这个命令只请求精确的主机名 CapRover 的供给 。
- 需要通配符证书的,将请求与基础域及其通配符名称分开规划.
- 标注到基域的规则也符合其子域,所以检查 [规则匹配者](https://github.com/caprover/caprover/blob/master/src/user/system/CertbotManager.ts) 在规则中添加通配符之前。
- 在可支配域上测试所产生的命令; 准确的插件标记和 DNS 证书取决于您的提供者 。
- 如果 CapRover 的域验证不适合只用于 DNS 验证, 请审查 `skipVerifyingDomains` 单独确认所有权。

- 在更改一个生产服务器之前,保存工作覆盖和证书状态,对照插件文档验证您的自定义 Certbot 命令,并在可支配域上测试发行.
- 重新启动 CapRover 服务 `docker service update captain-captain --force` 因此它装入了更改的覆盖。
- 对于备用的ACME服务器,Certbot可能还需要一个 `cli.ini` 下级 `/captain/data/letsencrypt/etc/` 包含服务器 URL 和任何需要的外部账户绑定证书; 检查 ACME 提供者的指示和您的 DNS CAA 记录。
- 永远不要将 DNS API 证书输入寄存器 。
