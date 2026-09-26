---
id: defaults-limits
title: Defaults and Limits
slug: /reference/defaults-limits
---

Selected defaults from [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) and [EnvVars.ts](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts):

| Setting | Default |
| --- | --- |
| CapRover state directory | `/captain`; backed-up data is `/captain/data` |
| Host HTTP, HTTPS, admin ports | `80`, `443`, `3000` |
| Dashboard subdomain | `captain` |
| API version | `v2` |
| Default Docker log size | `512m` |
| Build log lines and app log tail | `50` and `500` respectively |
| Maximum saved deployment versions | `50` |
| Docker build version selector | `2` |
| Scheduled image-cleanup retention when disabled | `1` |

These are source defaults, not guarantees for every installation; values can be overridden and may change by release. Check your instance's version and the matching source before automating against them.
