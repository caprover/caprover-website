---
id: config-override
title: config-override.json
slug: /reference/config-override
---

CapRover reads user overrides from `/captain/data/config-override.json`. Only keys under `configs` in [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) are intended for this file. Example:

```json
{"defaultMaxLogSize": "256m"}
```

Back up the file before changing it, use valid JSON, and restart the CapRover service for startup settings to take effect. Incorrect overrides can prevent startup or weaken domain verification. Review the actual source defaults and your installation's version before changing values; `skipVerifyingDomains` is for controlled exceptional setups rather than routine public installation.

This file is under `/captain/data`, so it is included in a [CapRover backup](../server/backup/contents.md).
