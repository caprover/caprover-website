---
id: index
title: Backup & Restore CapRover
slug: /server/backup
---

<span id="source-server-backup-contents"></span>

## What Is Backed Up

A CapRover backup copies **`/captain/data`** and adds metadata about cluster nodes. This includes CapRover configuration and state, such as app definitions, domain settings, and certificates stored there.

- It does **not** automatically include Docker volumes, host bind mounts outside that directory, database contents stored in those locations, uploaded files there, or locally built Docker images.
- Back up each database using its own consistent export or snapshot process, and copy the persistent directories you actually use.
- Test that both the CapRover archive and the application data can be restored.

- An exception to the image rule is a **self hosted registry**: its stored image data is under `/captain/data/registry`, so that directory is copied and may greatly increase archive size.
- With an external registry, keep its credentials and image retention policy available for restoration.
- Without accessible images, redeploy apps after restoring their definitions.

See [Create a Backup](index.md#source-server-backup-create), [Restore a Server](restore.md), and [Persistent Directories](../../data-persistence/index.md).

<span id="source-server-backup-create"></span>

## Create a Backup

1. In the CapRover dashboard, go to **Settings** and select **Create Backup**.
2. Download the resulting `.tar` file, verify it is nonempty, and store it outside the server with access controls.
3. Back up application databases and persistent directories separately; [the CapRover archive has limited scope](index.md#source-server-backup-contents).
4. Periodically restore both kinds of backup to a test server and verify the applications.

- The archive is generated on the server, then offered as a temporary download.
- Keep your own copy: the generated download is temporary.
- If a self hosted registry is enabled, allow space for its image data in the archive.

<span id="source-server-backup-automate"></span>

## Automate Backups

- The dashboard's **Create Backup** action has a corresponding authenticated API endpoint.
- The following example needs `curl` and `jq`.
- Set `CAPROVER_URL` to your HTTPS dashboard origin and provide `CAPROVER_PASSWORD` securely through your scheduler's secret store.

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

- Move the file to dated off-server storage, encrypt it as appropriate, and set retention and failure alerts.
- The download token is temporary; finish the download in the same run.
- Schedule separate database and volume backups and regularly test restoration.

<span id="source-reference-backup-contents"></span>

## Backup Contents

The [backup implementation](https://github.com/caprover/caprover/blob/master/src/user/system/BackupManager.ts) archives `/captain/data` and adds `meta/backup.json` with the CapRover salt and cluster node metadata.

| Included | Excluded unless stored inside `/captain/data` |
| --- | --- |
| Saved CapRover configuration, app definitions, certificates, and self hosted registry data under `/captain/data/registry`. | Docker volumes and host bind mounts elsewhere, database files there, and local Docker image store. |

- The registry exception can make archives large.
- The restore code looks for `/captain/backup.tar` at initial installation and expands it into `/captain/restoring`.
- See [What Is Backed Up](index.md#source-server-backup-contents) and [Restore a Server](restore.md) for the full recovery sequence.
