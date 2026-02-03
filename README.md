# 快速开始

只需三步，即可在本地启动 `Nest Vue Admin`。

## 📦 开发环境配置

### 环境要求
- **Node.js**: >= 20.x
- **pnpm**: 推荐使用最新版本
- **数据库**: MySQL >= 5.7.44

## 1. 克隆项目

```bash
git clone https://github.com/weips001/nest-vue-admin.git
cd nest-vue-admin
pnpm i
```

## 2. 数据库部署指引

::: info 涉及文件清单
- **环境变量配置文件**：`apps/server/.env`
- **初始数据脚本**：`apps/server/nest-vue-admin.sql`
  :::

### 2.1 配置数据库连接
首先，你需要让服务端程序能够访问到你的 MySQL 数据库。

**操作步骤：**
1. 找到 `apps/server/.env` 文件
2. 将 `DATABASE_URL` 修改为你的实际连接信息：

```bash
DATABASE_URL="mysql://root:Aa123456@127.0.0.1:3306/nest-vue-admin?connection_limit=20&pool_timeout=0"
```
**参数解析：**

- **用户名**: `root`
- **密码**: `Aa123456`
- **地址/端口**: `127.0.0.1:3306`
- **数据库名**: `nest-vue-admin`

> **✅ 如何验证：**
> 使用 Navicat、TablePlus 或 DBeaver 尝试连接该配置。如果能成功连接到 MySQL 并看到对应的空库（即使没有表），说明连接链条已通。

### 2.2 同步数据库表结构并初始化数据

本项目使用 **Prisma ORM**。我们将通过代码中定义的 Schema 自动生成数据库表，无需手动执行建表语句。

**操作步骤：**

```bash
# 1. 进入服务端目录
cd apps/server

# 2. 执行模型同步（生成物理表）
pnpm run db:m

# 3. 初始化数据
pnpm run seed
```
> **✅ 如何验证：**
> - 数据库查验：刷新你的数据库工具，确认库中已自动生成 SysUser、SysRole、Temp 等数十张业务表。
> - sys_user、temp、sys_dict、sys_dict_detail、sys_menu 等表中均有数据

## 3. 项目启动

### 3.1 服务端启动
```bash
cd apps/server

pnpm run start
```
后端服务将在 `http://localhost:3000` 启动。

### 3.2 前端启动
```bash
cd apps/web 

pnpm run start
```
前端服务将在 `http://localhost:5173` 启动。

## 👤 登录系统

打开浏览器访问 `http://localhost:5173`，使用以下默认账号登录：

- **用户名**: admin
- **密码**: 123456

成功登录后，你将看到系统的主界面。
