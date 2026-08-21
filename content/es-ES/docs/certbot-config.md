---
id: certbot-config
title: Overrides de Certbot
sidebar_label: Overrides de Certbot
---


### NOTA:
La mayoría (casi todos) los usuarios no necesitan modificar las configuraciones de Certbot. CapRover lo administra automáticamente por usted. ¡Deberías saltarte esta página!

<br/>

## Personaliza el comando Certbot para usar el desafío DNS-01

A partir de CapRover 1.12.0, puedes personalizar el comando que Certbot utiliza para generar certificados SSL. De forma predeterminada, CapRover usa el siguiente comando:
```bash
certbot certonly --webroot -w ${webroot} -d ${domainName}
```
que funciona a través del desafío HTTP-01. En este modo, Certbot verificará la propiedad de su dominio enviando una solicitud a `http://<YOUR_DOMAIN>/.well-known/acme-challenge/<TOKEN>` donde el contenido de `<TOKEN>` es generado por Certbot.

Este desafío funciona bien para la mayoría de los usuarios, pero opcionalmente puedes utilizar un desafío diferente si así lo deseas. Puede hacerlo anulando el comando de generación de certificados de Certbot.

### 1) Certbot Docker imagen
La imagen predeterminada Certbot Docker no incluye los [complementos de terceros](https://hub.docker.com/r/certbot/certbot). Necesitas crear una imagen personalizada:

Por ejemplo, para Cloudflare:
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

### 2) Guarde sus credenciales DNS

```bash
mkdir /captain/data/letencrypt/etc/captain-files
nano mycreds.ini
```
Luego ingrese sus credenciales DNS. Por ejemplo, para Cloudflare DNS, puedes usar:
```text
# Cloudflare API token used by Certbot
dns_cloudflare_api_token = 0123456789abcdef0123456789abcdef01234567
```
Ver detalles [aquí](https://eff-certbot.readthedocs.io/en/stable/using.html#dns-plugins)


### 3) Anular el comando Certbot

Edite `/captain/data/config-override.json` ejecutando:
```bash
nano /captain/data/config-override.json
```

Luego ingrese el siguiente blob. Asegúrese de reemplazar `your/repo:certbot-sleeping` y cambiar `certbotCertCommand` para satisfacer sus necesidades.

Por ejemplo, para un certificado comodín necesita un certificado para el dominio y también otro para los subdominios. Debes agregarlos así `-d ${domainName} -d \"*.${domainName}\"`.

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

### 4) Reiniciar CapRover

```bash
docker service update captain-captain --force
```

Ahora, cuando le pides a CapRover que genere un certificado SSL, utiliza el desafío DNS.

<br/>
<br/>
<br/>

## Configure Certbot para usar un nuevo servidor ACME

### 1) Crear archivo de configuración

Normalmente, el directorio `/captain/data/letsencrypt/etc` debe contener el volumen utilizado por Certbot,
para configurar Certbot, agregue un archivo `cli.ini` en este directorio:
```
$ cd /captain/data/letsencrypt/etc/
$ nano cli.ini
```

### 2) Configurar los valores

Tomaremos como ejemplo el servidor ACME de ZeroSSL para guiarlo sobre los pasos necesarios para que Certbot funcione correctamente con él.

Primero (al menos para ZeroSSL, necesita obtener las credenciales de EAB que están [aquí](https://app.zerossl.com/developer)) agregamos nuestro correo electrónico y le decimos a Certbot que acepte los TOS del servicio:
```
email = foo@example.com
agree-tos = true
```

luego agregamos el servidor (y si es necesario las credenciales de EAB):
```
server = https://acme.zerossl.com/v2/DV90 # (change it with your ACME server)
eab-kid = some-short-string
eab-hmac-key = a-big-key
```

### 3) Reiniciar Certbot

Luego, para aplicar nuestros cambios necesitamos actualizar el servicio de Certbot:
```
$ docker service update captain-certbot
```

¡Y ya está!

### 4) Registro CAA

Recuerda agregar un registro CAA en tu DNS para evitar cualquier problema al generar certificados SSL

por ejemplo, ZeroSSL necesita que tengas:
```
<your domain>. 3600 IN CAA 0 issue "sectigo.com"
<your domain>. 3600 IN CAA 0 issuewild "sectigo.com"
```
