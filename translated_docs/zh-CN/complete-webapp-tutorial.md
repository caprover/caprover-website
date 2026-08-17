---
id: complete-webapp-tutorial
title: 完整 Web 应用教程
sidebar_label: 完整 Web 应用教程
---


<br/>

这是一个简短的通用教程，帮助你理解如何设计一个包含多个组件的应用架构。

假设我们想做一个 [HOTDOG or NOT HOTDOG](https://www.theverge.com/2017/6/26/15876006/hot-dog-app-android-silicon-valley) 的 Web 应用版本。



## 应用说明
假设我们要创建一个 Web 应用，展示一组照片，并有一行文字说明图片是 hotdog 还是 not hotdog，类似这样：

- <IMAGE> Tags: Hotdog, Upload date: 2017-11-12
- <ANOTHER IMAGE> Tags: NOT Hotdog, Upload date: 2017-07-08
- <ANOTHER IMAGE> Tags: Hotdog, Upload date: 2017-07-07
- ....

任何人都可以上传图片，我们非常聪明的人工智能会给图片打上 HOTDOG 或 NOT-HOTDOG 标签，然后我们把图片保存在服务器上，并把上传日期和标签保存在数据库中。

## 应用架构
为了实现这个应用，假设我们决定使用以下组件：
- NodeJS WebApp：（包括静态资源、前端应用和 API）
- PHP 图片上传应用：我们可以向它发送 POST 请求，把照片保存到磁盘
- MongoDB：用来保存上传信息（标签、上传日期等）
- PYTHON 图像识别服务：我们可以向它发送 POST 请求，判断图片是 HOTDOG 还是 NOT HOTDOG

```
                        +---------------------+
                        |                     |
                        |   NodeJS Webapp     |
                        |                     |
        +---------------+------------+--------+-----------------+
        |                            |                          |
        |                            |                          |
        |                            |                          |
        |                            |                          |
        |                            |                          |
+-------v-----------+     +----------v----------+   +-----------v---+
|                   |     |                     |   |               |
| PHP File Uploader |     | Python ImageDetector|   |    MongoDB    |
|                   |     |                     |   |               |
+-------------------+     +---------------------+   +---------------+

```

## 是否持久化
CapRover 允许你标明应用/数据库/服务是否有持久化数据。有持久化的应用可以有 “persistent directories”。如果应用崩溃，Captain 启动该应用的新实例，这些目录会被保留。如果应用崩溃，Captain 启动新实例，其他目录会被清空并重置为默认状态。在我们的例子中：
- WebApp：没有/不需要任何持久化。
- 图片上传应用：需要一个持久化目录来把图片保存在磁盘上（例如 `/uploaded_files`）
- MongoDB。当然需要持久化（我们在这里保存信息），我们不希望只因为 MongoDB 崩溃或服务器重启就丢失数据库。
- PYTHON 图像识别应用。这个应用不需要在磁盘上保存任何数据。它只接收图片，做一些图像处理，然后告诉客户端图片是 HOTDOG 还是 NOT HOTDOG。

## 创建服务：
- NodeJS Web 应用：写完这个应用后，在 Captain 上创建一个 webapp，命名为 `my-webapp`，不要勾选 persistency 复选框，然后部署应用。
- 图片上传应用：和上面的 webapp 类似，但创建应用时勾选 persistence 复选框。把这个应用命名为 `image-uploader`。之后打开应用详情页，添加一个持久化目录，目录路径是你的应用保存图片的位置。这取决于你的应用，在这个例子中假设是 `/uploaded_files`
- MongoDB：使用一键应用安装器创建一个 MongoDB 实例。把这个容器命名为 `my-mongodb`。容器（数据库）创建后，你可以打开详情页，会看到 Captain 已经自动为这个容器分配了一些持久化目录。这就是 MongoDB 保存数据的地方。
- Python 图像识别应用：再次在 Captain 上创建一个新应用。这个应用不需要设置 persistence，因为它不在磁盘上保存信息。把这个应用命名为 `image-processor`。


## 内部访问
为了让 Web 应用工作，它需要能与 MongoDB 实例、图片上传服务和图像处理服务通信。如果你想从另一个容器访问某个容器，只需在容器名前加上 `srv-captain--` 前缀。例如，要连接到我们命名为 `my-mongodb` 的 MongoDB 实例，可以在 NodeJS 应用中加入下面这行（使用 mongoose 库）
```
mongoose.connect("mongodb://srv-captain--my-mongodb/mydatabase", { useMongoClient: true });
```
当然，你也可以在 URI 中加入用户名和密码，见[这里的例子](https://stackoverflow.com/questions/7486623/mongodb-password-with-in-it)。

其他服务也一样；如果你想把图片上传到图片上传服务，只需通过 `http://srv-captain--imageuploader` 访问它。
