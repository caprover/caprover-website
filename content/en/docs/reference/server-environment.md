---
id: server-environment
title: Server Environment Variables
slug: /reference/server-environment
---

The [environment-variable parser](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts) recognizes these server-level inputs:

| Name | Effect |
| --- | --- |
| `ACCEPTED_TERMS` | Accept installation terms at initial launch. |
| `DEFAULT_PASSWORD` | Set the initial dashboard password; replace it after setup. |
| `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, `CAPTAIN_HOST_ADMIN_PORT` | Published host ports; defaults are 80, 443, and 3000. Match the host side of the Docker `-p` mappings. |
| `MAIN_NODE_IP_ADDRESS` | Supply the manager address for installation when automatic detection is unsuitable. |
| `CAPTAIN_BASE_DIRECTORY` | Override the default `/captain` base directory. |
| `CAPROVER_DISABLE_ANALYTICS`, `DO_NOT_TRACK` | Disable analytics when set. |
| `CAPTAIN_DOCKER_API` | Override Docker API connection details. |
| `CAPTAIN_IS_DEBUG`, `IS_CAPTAIN_INSTANCE`, `DEMO_MODE_ADMIN_IP`, `FORCE_ENABLE_PRO`, `BY_PASS_PROXY_CHECK` | Internal, development, or special-purpose controls; use only after reading their source usage. |

- The parser treats several boolean flags as true when the variable is a **nonempty string**; passing the literal string `false` does not necessarily turn them off.
- Supply installation variables to the initial container command, and use [config overrides](server-environment.md) for configurable server constants.

<span id="source-reference-config-override"></span>

## config-override.json

CapRover reads user overrides from `/captain/data/config-override.json`. Only keys under `configs` in [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) are intended for this file. Example:

```json
{"defaultMaxLogSize": "256m"}
```

- Back up the file before changing it, use valid JSON, and restart the CapRover service for startup settings to take effect.
- Incorrect overrides can prevent startup or weaken domain verification.
- Review the actual source defaults and your installation's version before changing values; `skipVerifyingDomains` is for controlled exceptional setups rather than routine public installation.

This file is under `/captain/data`, so it is included in a [CapRover backup](../server/backup/index.md).
