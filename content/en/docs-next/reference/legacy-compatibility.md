---
id: legacy-compatibility
title: Legacy Compatibility
slug: /reference/legacy-compatibility
---

CapRover has historical names and links from its CaptainDuckDuck predecessor. Existing `/docs/*` paths remain live during this preview; see the [draft URL map](https://github.com/caprover/caprover-website/blob/master/DOCS_NEXT_URL_MAP.md) for proposed old-to-new destinations. Redirects belong to the later cutover review.

The Captain Definition parser accepts **`schemaVersion: 2`**. Older definitions need migration; see [CaptainDuckDuck migration](../guides/cdd-migration.md). The app model retains `isLegacyAppName` for apps created before CapRover 1.15.0, which affects service-name compatibility. Check [internal networking](../domains/internal-networking.md) before changing hard-coded internal hostnames.

Do not remove existing URLs or legacy service aliases as part of preview publishing. Test each historic link and deployed application at the eventual cutover.
