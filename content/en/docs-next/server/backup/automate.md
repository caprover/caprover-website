---
id: automate
title: Automate Backups
slug: /server/backup/automate
---

The dashboard's **Create Backup** action has a corresponding authenticated API endpoint. The following example needs `curl` and `jq`. Set `CAPROVER_URL` to your HTTPS dashboard origin and provide `CAPROVER_PASSWORD` securely through your scheduler's secret store.

```bash
set -euo pipefail
umask 077
api_token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
download_token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/createbackup" \
  -H "x-captain-auth: $api_token" -H 'x-namespace: captain' \
  --data '{"postDownloadFileName":"backup.tar"}' | jq -er '.data.downloadToken')
curl --fail --silent --show-error -G "$CAPROVER_URL/api/v2/downloads/" \
  --data-urlencode 'namespace=captain' --data-urlencode "downloadToken=$download_token" \
  -o backup.tar
test -s backup.tar
```

Move the file to dated off-server storage, encrypt it as appropriate, and set retention and failure alerts. The download token is temporary; finish the download in the same run. Schedule separate database and volume backups and regularly test restoration.
