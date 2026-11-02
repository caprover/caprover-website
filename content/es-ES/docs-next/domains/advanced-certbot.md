---
id: advanced-certbot
title: Certbot avanzado / ACME
slug: /domains/advanced-certbot
---

La configuración normal de Certbot utiliza un desafío HTTP-01 mediante webroot. Mantén el puerto 80 accesible y el hostname apuntando a CapRover. Cambia este flujo solo si no cubre los requisitos de tus certificados.

- CapRover puede leer `certbotCertCommandRules` y `certbotImageName` desde `/captain/data/config-override.json`.
- Para DNS-01 necesitas una imagen de Certbot compatible que incluya el plugin necesario y credenciales accesibles desde ese contenedor durante su ejecución.
- Por ejemplo, con el plugin DNS de Cloudflare, guarda su archivo de credenciales bajo `/captain/data/letsencrypt/etc/captain-files/` con permisos restrictivos y configura la imagen y el comando:

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

- Sustituye la imagen por una compatible con el plugin DNS y el entorno de CapRover; la imagen estándar no incluye todos los plugins de terceros. CapRover sustituye `${domainName}`.
- La regla `"domain": "*"` se aplica a **todas** las solicitudes de certificados, pero este comando solicita solo el hostname exacto suministrado por CapRover.
- Si necesitas un certificado wildcard, planifica una solicitud separada para el dominio base y su nombre wildcard.
- Una regla aplicada al dominio base también coincide con sus subdominios. Revisa el [matcher de reglas](https://github.com/caprover/caprover/blob/master/src/user/system/CertbotManager.ts) antes de añadir un wildcard.
- Prueba el comando en un dominio descartable. Los parámetros del plugin y las credenciales dependen de tu proveedor.
- Si la verificación de dominios de CapRover no encaja con DNS-01, revisa `skipVerifyingDomains` por separado y verifica la titularidad del dominio.

- Antes de cambiar producción, guarda el override y los certificados actuales, comprueba el comando con la documentación del plugin y prueba la emisión en un dominio de prueba.
- Reinicia el servicio con `docker service update captain-captain --force` para cargar el override.
- Si utilizas un servidor ACME alternativo, Certbot también puede necesitar `cli.ini` bajo `/captain/data/letsencrypt/etc/` con la URL del servidor y las credenciales de external-account-binding. Consulta al proveedor ACME y comprueba los registros CAA.
- No subas credenciales DNS API a un repositorio.
