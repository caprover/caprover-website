---
id: certbot-config
title: Configure Certbot to use a new ACME Server
sidebar_label: Change ACME Server
---


### NOTE:
Most (almost all) users do not need to modify Certbot configs. CapRover automatically manages it for you. You can skip this page.

## First step

Normally, the directory `/captain/data/letsencrypt/etc` should contain the volume used by Certbot,
to configure Certbot, add a `cli.ini` file in this directory:
```
$ cd /captain/data/letsencrypt/etc/
$ nano cli.ini
```

## Configure the right things

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

## Restart certbot

Then to apply our changes we need to update Certbot's service:
```
$ docker service update captain-certbot
```

And you're done !

## CAA Record

Remember to add a CAA record in your DNS to avoid any problem when generating SSL certs

for example, ZeroSSL need you to have:
```
<your domain>. 3600 IN CAA 0 issue "sectigo.com"
<your domain>. 3600 IN CAA 0 issuewild "sectigo.com"
```
