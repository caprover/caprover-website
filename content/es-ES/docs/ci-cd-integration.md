---
id: ci-cd-integration
title: Integración CI/CD
sidebar_label: Introducción
---

Si bien CapRover es capaz de compilar su código fuente y convertirlo en una imagen Docker muy fácilmente, a menudo se da cuenta de que el proceso de compilación es muy pesado. De hecho, en muchos casos, es más pesado que la carga de la propia aplicación. Esto puede provocar una caída del servidor cuando intentas crear tu código fuente en tu propio servidor. La mejor manera de evitar estas cargas pesadas es crear su imagen Docker en otro lugar y simplemente implementar el artefacto creado en su servidor CapRover.

Hay muchas plataformas CI/CD sencillas que ofrecen generosos minutos gratis para sus compilaciones; por ejemplo, GitHub y GitLab ofrecen minutos gratis para repositorios privados y minutos gratuitos ilimitados para repositorios públicos.

¡Lea más sobre [Github integración](ci-cd-integration/deploy-from-github.md) y [Gitlab integración](ci-cd-integration/deploy-from-gitlab.md) a continuación!
