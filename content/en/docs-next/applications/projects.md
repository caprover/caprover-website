---
id: projects
title: Organize Apps with Projects
slug: /applications/projects
---

Projects organize apps in the dashboard. A project has a name and optional description, and can have a parent project. An app can be assigned to a project; the backend checks that the selected project exists before saving the app's configuration.

Create a project in the dashboard's Projects area, optionally choose a parent, then assign apps to it from the app settings. Use a hierarchy that helps your operators find related services, such as `Production → Payments`. Project membership is an organizational attribute of the app rather than a separate Docker network or access boundary.

Review any apps and nested projects before deleting a project. Project deletion changes organization, not the need to back up or migrate those apps and their data.
