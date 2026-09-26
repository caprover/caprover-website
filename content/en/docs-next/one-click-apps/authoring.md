---
id: authoring
title: Authoring One-Click Apps
slug: /one-click-apps/authoring
---

A One-Click template describes services and their installation inputs. In the current model, a template declares `captainVersion`, a `services` map, and `caproverOneClickApp` metadata with display name, variables, and start/end instructions. Services support a documented subset of Compose-like fields plus `caproverExtra` for CapRover-specific HTTP and build settings.

Choose image tags deliberately, provide meaningful variable labels and validation, persist stateful data, and avoid insecure default credentials or unnecessarily published ports. Test installation on a disposable server, inspect every generated app, verify the instructions, and exercise a fresh installation and a recovery path.

For exact field names and types, use the [One-Click App Schema](../reference/one-click-schema.md) and the current [one-click-apps repository](https://github.com/caprover/one-click-apps). The catalog is dynamic; avoid documenting a fixed list of app names as if it were guaranteed.
