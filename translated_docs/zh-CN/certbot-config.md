---
id: certbot-config
title: Certbot 覆盖配置
sidebar_label: Certbot 覆盖配置
---


### 注意：
大多数（几乎所有）用户都不需要修改 Certbot 配置。CapRover 会自动为你管理它。你应跳过这一页。

<br/>

## 自定义 Certbot 命令以使用 DNS-01 challenge

从 CapRover 1.12.0 开始，你可以自定义 Certbot 用于生成 SSL 证书的命令。默认情况下，CapRover 使用下面的命令：
```bash
certbot certonly --webroot -w ${webroot} -d ${domainName}
```
它通过 HTTP-01 challenge 工作。在这种模式下，Certbot 会向 `http://<YOUR_DOMAIN>/.well-known/acme-challenge/<TOKEN>` 发送请求，以验证你对域名的所有权，其中 <TOKEN> 的内容由 Certbot 生成。

这个 challenge 对大多数用户都适用，但如果你愿意，也可以选择使用不同的 challenge。你可以通过覆盖 Certbot 的证书生成命令来实现。

### 1) Certbot Docker 镜像
默认的 Certbot Docker 镜像不包含[第三方插件](https://hub.docker.com/r/certbot/certbot)。你需要构建一个自定义镜像：

例如，对于 Cloudflare：
```Dockerfile
# Change this to any other base image listed here: https://hub.docker.com/r/certbot/certbot
## Make sure to use the same version that CapRover uses by default (`certbotImageName` in [CaptainConstant](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts#L58)) 
BASE_IMAGE="certbot/dns-cloudflare:v2.11.0"  

TEMP_DOCKERFILE=$(mktemp)
cat > $TEMP_DOCKERFILE <<EOF
FROM $BASE_IMAGE
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["sleep 9999d"]
EOF
docker build -t certbot-customized -f $TEMP_DOCKERFILE .
rm $TEMP_DOCKERFILE
```

### 2) 保存 DNS 凭据

```bash
mkdir /captain/data/letencrypt/etc/captain-files
nano mycreds.ini
```
然后输入你的 DNS 凭据。例如，对于 Cloudflare DNS，你可以使用：
```text
# Cloudflare API token used by Certbot
dns_cloudflare_api_token = 0123456789abcdef0123456789abcdef01234567
```
细节见[这里](https://eff-certbot.readthedocs.io/en/stable/using.html#dns-plugins)


### 3) 覆盖 Certbot 命令

运行下面的命令，编辑 `/captain/data/config-override.json`：
```bash
nano /captain/data/config-override.json
```

然后输入下面的内容。确保替换 `your/repo:certbot-sleeping`，并按需要修改 `certbotCertCommand`。

例如，对于通配符证书，你需要一张域名证书，以及一张子域名证书。你需要像这样添加它们：`-d ${domainName} -d \"*.${domainName}\"`。

```json
{
  "skipVerifyingDomains": "true",
  "certbotImageName": "certbot-customized",
  "certbotCertCommandRules": [
    {
      "domain": "*",
      "command":  "certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/captain-files/mycreds.ini -d ${domainName} -d \"*.${domainName}\"" 
    }
  ]
}
```

### 4) 重启 CapRover

```bash
docker service update captain-captain --force
```

现在，当你让 CapRover 生成 SSL 证书时，它会使用 DNS challenge。

<br/>
<br/>
<br/>

## 配置 Certbot 使用新的 ACME 服务器

### 1) 创建配置文件

通常，`/captain/data/letsencrypt/etc` 目录应包含 Certbot 使用的卷。
要配置 Certbot，在这个目录中添加一个 `cli.ini` 文件：
```
$ cd /captain/data/letsencrypt/etc/
$ nano cli.ini
```

### 2) 配置值

我们以 ZeroSSL 的 ACME 服务器为例，说明让 Certbot 正确使用它所需的步骤。

首先（至少对于 ZeroSSL，你需要获取 EAB 凭据，它们在[这里](https://app.zerossl.com/developer)）我们加入邮箱，并告诉 Certbot 接受该服务的 TOS：
```
email = foo@example.com
agree-tos = true
```

然后我们加入服务器（以及需要时的 EAB 凭据）：
```
server = https://acme.zerossl.com/v2/DV90 # (change it with your ACME server)
eab-kid = some-short-string
eab-hmac-key = a-big-key
```

### 3) 重启 Certbot

然后，要应用更改，我们需要更新 Certbot 的服务：
```
$ docker service update captain-certbot
```

这样就完成了。

### 4) CAA 记录

记住在 DNS 中添加 CAA 记录，以避免生成 SSL 证书时出现问题。

例如，ZeroSSL 需要你有：
```
<your domain>. 3600 IN CAA 0 issue "sectigo.com"
<your domain>. 3600 IN CAA 0 issuewild "sectigo.com"
```
