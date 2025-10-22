# Phoenix-Admin-Pro-Portal

---

## <div style="color: red">开箱须知：</div>

1. <div style="color: red">全局替换 Phoenix-Admin-Pro-Portal 为项目中文名称，如 【数据归档系统】，除 package.json 中 name 需替换为英文名称；</div>
2. <div style="color: red">全局替换 projectName 为项目英文名称，如【archive】。</div>

---

基于 Phoenix 搭建的 Portal 子应用模板

注：基于 [Phoenix](http://100.69.37.5:8000/) 框架开发，具体可参考 Phoenix 在线文档

# 一、Phoenix-Admin-Pro-Portal

Phoenix Admin Pro 管理后台代码仓库，主要功能目录如下：

|-系统管理 |-系统配置 |-日志

- ...

# 二、主要技术栈

- node.js v18.17.1（14+）（服务端 js 内核）
- react v18.2.0（前端 UI 基础框架）
- umijs/max v4+（基于 React 封装的脚手架）
- antd v5.5.2（组件库）
- ant-design/pro-component（适用于管理后台的高级组件库）
- ~~moment(日期、时间相关方法库，已用轻量 dayjs 替代，计划后续将相关代码全部移除)~~

# 三、运行方式

1. 全局安装 Node.js（推荐参考 [Phoenix 环境配置](http://100.69.37.5:8000/env-config) 方式安装在指定目录）

登录 FTP，下载 <code>Node.js</code>，确保 <code>node</code> 版本是 14+，在终端检测能输出版本号则说明 Node.js 安装成功，同时会默认安装 <code>npm</code>。

```bash
node -v
# v18.17.1
```

2. 指定源为内网仓库

<code>npm</code> 默认从外网源安装依赖，由于开发机无法访问外网，故需要将安装源指定为内网仓库（通常会提前搭建内网源，并将外网依赖进行同步），设置方式如下：

```bash
npm config set registry http://100.74.128.139:8060/repository/npm-public
```

安装成功检测：

```bash
npm config list
# registry = "http://100.74.128.139:8060/repository/npm-public"
```

3. 全局安装 pnpm

前端项目一般使用 <code>npm</code> 进行依赖管理，<code>pnpm</code> 代表 performance npm (高性能 npm)，通过符号链接、硬链接等方式实现多项目依赖共享，并支持依赖缓存，从而较大程度提升性能，并节省磁盘空间，安装方式如下：

```bash
npm install -g pnpm
```

安装成功检测：

```bash
pnpm -v
# 8.10.0
```

4. 项目初始化

切到项目根目录下执行依赖安装命令，成功后会在根目录下新创建一个 <code>node_modules</code> 目录，如果项目新增或修改依赖直接执行此命令即可。

```bash
pnpm install
```

5. 启动项目

在根目录下执行项目启动命令即可运行项目：

```bash
npm run start  // 启动本地环境
npm run start:bbit  // 启动测试环境
```

<span style="color:red"><strong>注</strong></span>：<code>npm run</code> 执行的是项目中预先配置好的脚本命令，可以理解为一个快捷指令，具体执行的脚本语句需在根目录下的 <code>package.json</code> 中 <code>scripts</code> 下配置指令映射。

6. 打包项目

上线前需要将项目进行构建打包，生成可在浏览器端运行的代码，同时执行大量优化工作（通常在 <code>jenkins</code> 中操作环境部署前执行）。打包命令如下，打包成功后会在根目录下生成 <code>dist</code> 目录产物：

```bash
npm run build
```

7. 部署上线

通过 Jenkins 自动化部署

8. 开发环境部署

Jenkins 选择 <code>ngccs-ccsfront-bbit</code>

9. 测试环境部署

Jenkins 选择 <code>ngccs-ccsfront-sit</code>
