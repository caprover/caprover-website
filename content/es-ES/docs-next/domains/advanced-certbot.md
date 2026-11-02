---
id: advanced-certbot
title: Certbot avanzado / ACME
slug: /domains/advanced-certbot
---

La ruta normal de Certbot utiliza un reto webroot HTTP-01. Mantenga el puerto 80 accesible y el nombre de host apuntado a CapRover. Cambia esto sólo cuando ese camino no puede cumplir con los requisitos de tu certificado.

- CapRover puede leer `certbotCertCommandRules` y `certbotImageName` desde `/captain/data/config-override.json`.
- DNS-01 necesita una imagen de plugin Certbot compatible y de larga duración y credenciales legibles dentro de ese contenedor.
- Para un plugin de Cloudflare DNS, por ejemplo, almacenar su archivo de credenciales bajo `/captain/data/letsencrypt/etc/captain-files/` con permisos restrictivos, luego configura la imagen y el comando:

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

- Reemplaza la imagen con una que incluye el plugin DNS y funciona como CapRover espera; la imagen de stock no incluye cada plugin DNS de terceros. `${domainName}` se expande por CapRover.
- El `"domain": "*"` la norma aplicable **cada uno** solicitud de certificado, pero este comando sólo solicita el nombre de host exacto CapRover suministros.
- Si usted necesita un certificado de comodín, plan que solicite por separado con el dominio base y su nombre de comodín.
- Una regla abarcada a un dominio base también coincide con sus subdominios, así que compruebe el [regla matcher](https://github.com/caprover/caprover/blob/master/src/user/system/CertbotManager.ts) antes de añadir un comodín a una regla.
- Prueba el comando resultante en un dominio desechable; las banderas de plugin exactas y las credenciales DNS dependen de su proveedor.
- Si la verificación de dominio de CapRover no es adecuada para la validación sólo DNS, revise `skipVerifyingDomains` por separado y confirmar la propiedad usted mismo.

- Antes de cambiar un servidor de producción, guarde el estado de anulación de trabajo y certificado, valide su comando Certbot personalizado contra la documentación del plugin, y la emisión de prueba en un dominio desechable.
- reiniciar el servicio CapRover con `docker service update captain-captain --force` Así que carga la anulación cambiada.
- Para un servidor ACME alternativo, Certbot también puede necesitar un `cli.ini` menores `/captain/data/letsencrypt/etc/` conteniendo la URL del servidor y cualquier credenciales de conexión externa requeridas; compruebe las instrucciones del proveedor de ACME y sus registros de DNS CAA.
- Nunca comprometas las credenciales de DNS API a un repositorio.
