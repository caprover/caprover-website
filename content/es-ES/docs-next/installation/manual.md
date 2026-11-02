---
id: manual
title: Configuración manual
slug: /installation/manual
---

Utilice este camino para instalar Docker y bootstrap CapRover usted mismo en un servidor Ubuntu 24.04 fresco.

## 1. Puertos y cortafuegos

Permitir los siguientes puertos en el firewall de su proveedor de alojamiento y, si utiliza UFW, en el servidor:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # Dashboard setup
sudo ufw status
```

Si UFW es inactivo, lo habilita con `sudo ufw enable` **después** permitiendo SSH. Puede restringir el puerto 3000 una vez que el panel funciona sobre HTTPS. See [Firewall](domains/firewall.md) para puertos multinodos.

## 2. Instalar Docker

Corre en el servidor:

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker version
sudo docker run --rm hello-world
```

Si la instalación falla debido a los paquetes existentes, siga [Guía Ubuntu de Docker](https://docs.docker.com/engine/install/ubuntu/)Use Docker Engine en lugar del paquete de snap.

## 3. Instalar CapRover

```bash
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

Cuando la configuración termina, abre `http://YOUR_SERVER_IP:3000`.

**Contraseña inicial:** `captain42`

Si el tablero es inalcanzable, compruebe `sudo docker service ls` y las reglas del cortafuegos del paso 1.

Continuar con [Configuración DNS y dashboard](../get-started.md#dns).
