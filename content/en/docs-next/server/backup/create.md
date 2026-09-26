---
id: create
title: Create a Backup
slug: /server/backup/create
---

1. In the CapRover dashboard, go to **Settings** and select **Create Backup**.
2. Download the resulting `.tar` file, verify it is nonempty, and store it outside the server with access controls.
3. Back up application databases and persistent directories separately; [the CapRover archive has limited scope](./contents.md).
4. Periodically restore both kinds of backup to a test server and verify the applications.

The archive is generated on the server, then offered as a temporary download. Keep your own copy: the generated download is temporary. If a self hosted registry is enabled, allow space for its image data in the archive.
