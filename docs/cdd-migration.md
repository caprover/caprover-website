---
id: cdd-migration
title: CaptainDuckDuck Upgrade
sidebar_label: CaptainDuckDuck Upgrade
---

Note: This second is only intended if you want to upgrade your CaptainDuckDuck server to CapRover.

### Steps

We are currently working on migration steps. Once it is developed and tested properly, we'll release details. You can have access to the migration script as soon as it becomes available by registering to the email updates. Make sure to [**Subscribe to Updates**](/#email-sub) to get an email when the migration process is ready to be used.


### Breaking Changes:
- `schemaVersion` for captain-definition file is changed to `2`.
- If you previously used a customized dockerfileLines, you have prefixed all `ADD` and `COPY` statements with `./src`. This is no longer needed with CapRover. For example, you previously had 
```bash
COPY ./src/package.json /usr/app/
```

With CapRover you should change this to

```bash
COPY ./package.json /usr/app/
```