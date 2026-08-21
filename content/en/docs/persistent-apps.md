---
id: persistent-apps
title: Persistent Apps
sidebar_label: Persistent Apps
---

<br/>

### Persistent vs. Non-Persistent Apps

When creating an app, you can choose whether it should have **persistent data**.  
By default, you should prefer **non-persistent apps** for better flexibility and scalability. However, some apps require persistence when they need to retain data across container restarts, crashes, or updates.

You can also map a directory on the host to a directory inside the container if you have a large amount of static data that you don’t want bundled with every build. This is generally not needed unless the data is very large.

---

#### Persistent Apps

Persistent apps are those that need to store data on disk so that it survives restarts, crashes, container updates, and other events. Because they store data locally, they are **locked to a specific server**. You can move them to another server, but any stored data will be lost unless you manually migrate it.

**Examples of apps that require persistence:**
- Databases (e.g., MySQL, PostgreSQL, MongoDB)
- Photo upload apps that store images locally instead of using third-party storage (e.g., S3)
- Web apps like WordPress that store uploaded files or plugins on disk

**Limitations:**
- Persistent apps **cannot** be scaled to multiple instances.  
  Sharing a single storage path across multiple containers can lead to data corruption.

> **Note:**  
> Even for persistent apps, **not all directories are persistent by default**. After creating the app, you must explicitly define which directories should be persistent via the **App Details** page on the dashboard.

---

##### Defining Persistent Directories

You can configure persistent directories in two ways:

**1. Using Labels (Recommended)**  
CapRover manages the storage location for you.  
- Data is stored under:  
  `/var/lib/docker/volumes/YOUR_VOLUME_NAME/_data`
- The container path is customizable.
- By default, CapRover prepends `captain--` to the volume name.  
  For example, entering `my-volume` results in `captain--my-volume`.

**2. Using Specific Host Paths**  
You can map a **specific directory on the host** to a path inside the container.  
For example:  
- Host path: `/var/usr`
- Container path: `/my-host-usr-something`
  
A file saved in the container at `/my-host-usr-something/myfile.txt` will be accessible on the host at `/var/usr/myfile.txt`.

> **Important:**  
> If you choose a specific host path, ensure that the directory **already exists** on the host before assigning it.

---

#### Removing Persistent Apps

When you delete a persistent app, its data is **not automatically removed**. This prevents accidental data loss. To delete persistent directories:

- **Volumes (label-based)**  
  1. List volumes:  
     ```bash
     docker volume ls
     ```
  2. Remove the desired volume:  
     ```bash
     docker volume rm NAME_OF_VOLUME
     ```

  ![Volumes](/img/docs/label-path.png)

- **Mapped Host Directories**  
  Remove the directory directly from the host:
  
```bash
  rm -rf /path/to/directory
```

![mapped](/img/docs/path-binding.png)

---

#### Non-Persistent Apps

Apps that **don’t need to store data on disk** should always be non-persistent.
They are more flexible and can automatically migrate between servers if one becomes unhealthy.

**Advantages of non-persistent apps:**

* Can run multiple instances without conflicts (isolated storage)
* Automatically redeployed on other servers in a multi-server setup

> Non-persistent apps **can still write to disk**, but any data stored there will be lost when the container restarts due to a crash, deployment, configuration update, or host restart.

**Examples:**

* An image processor that analyzes uploaded photos (stateless and CPU-intensive)
* A TODO web app where the database is persistent, but the web app itself does not store data locally
* An image upload app that uses S3 or other third-party storage instead of saving images locally
