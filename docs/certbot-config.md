---
id: certbot-config
title: Certbot Overrides
sidebar_label: Certbot Overrides
---


### NOTE:
Most (almost all) users do not need to modify Certbot configs. CapRover automatically manages it for you. You should skip this page!

<br/>

## Customize Certbot command to use DNS-01 challenge

As of CapRover 1.12.0, you're able to customize the command that Certbot uses to generate SSL certificates. By default, CapRover uses the following command:
```bash
certbot certonly --webroot -w ${webroot} -d ${domainName}
```
which works via HTTP-01 challenge. In this mode, Certbot will verify the ownership of your domain by sending a request to `http://<YOUR_DOMAIN>/.well-known/acme-challenge/<TOKEN>` where the content of <TOKEN> is generated by Certbot. 

This challenge works fine for most users, but you can optionally use a different challenge if you want to. You can do so by overriding the Certbot's certificate generation command. 

### 1) Certbot Docker image
The default Certbot Docker image does not include the [3rd party plugins](https://hub.docker.com/r/certbot/certbot). You need to build a custom image:

For example, for Cloudflare:
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

### 2) Store your DNS credentials

```bash
mkdir /captain/data/letencrypt/etc/captain-files
nano mycreds.ini
```
Then enter your DNS credentials. For example, for Cloudflare DNS, you can use:
```text
# Cloudflare API token used by Certbot
dns_cloudflare_api_token = 0123456789abcdef0123456789abcdef01234567
```
See details [here](https://eff-certbot.readthedocs.io/en/stable/using.html#dns-plugins)


### 3) Override the Certbot command

Edit `/captain/data/config-override.json` by running:
```bash
nano /captain/data/config-override.json
```

Then enter the following blob. Make sure to replace `your/repo:certbot-sleeping` and change `certbotCertCommand` to fit your needs.

For example for a wildcard certificate you need one certificate for domain and also one for subdomains. You need to add them like this `-d ${domainName} -d \"*.${domainName}\"`.

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

### 4) Restart CapRover

```bash
docker service update captain-captain --force
```

Now, when you ask CapRover to generate an SSL certificate, it uses the DNS challenge. 

<br/>
<br/>
<br/>

## Configure Certbot to use a new ACME Server

### 1) Create config file

Normally, the directory `/captain/data/letsencrypt/etc` should contain the volume used by Certbot,
to configure Certbot, add a `cli.ini` file in this directory:
```
$ cd /captain/data/letsencrypt/etc/
$ nano cli.ini
```

### 2) Configure the values

We will take as an example ZeroSSL's ACME server to guide you over the steps needed to make Certbot work correctly with it,

first (at least for ZeroSSL, you need to get EAB credentials which are [here](https://app.zerossl.com/developer)) we add our email and we tell Certbot to accept the TOS of the service:
```
email = foo@example.com
agree-tos = true
```

then we add the server (and if needed the EAB credentials):
```
server = https://acme.zerossl.com/v2/DV90 # (change it with your ACME server)
eab-kid = some-short-string
eab-hmac-key = a-big-key
```

### 3) Restart Certbot

Then to apply our changes we need to update Certbot's service:
```
$ docker service update captain-certbot
```

And you're done !

### 4) CAA Record

Remember to add a CAA record in your DNS to avoid any problem when generating SSL certs

for example, ZeroSSL need you to have:
```
<your domain>. 3600 IN CAA 0 issue "sectigo.com"
<your domain>. 3600 IN CAA 0 issuewild "sectigo.com"
```
