## 简介

- FreePress 是一个基于 React.js 的静态文档生成器。
- 在[RcPress](https://github.com/YvesCoding/rcpress)基础上进行精简和扩展
- 目的：为了能够灵活的定制自己的教程开发工具

## 用法

安装命令行工具 `@freepress/cli`

```bash

yarn global add @freepress/cli

# 或者如果你用npm

npm i  @freepress/cli -g
```

创建文件

```bash
# 创建 docs 目录(docs是默认的文档目录)
mkdir docs

#创建markdown文件
echo '# Hello FreePress' > docs/README.md
```

可以运行如下命令

```bash
# 启动spa模式的服务
freepress dev # 推荐
# 启动服务端渲染的服务
freepress server

# 访问`3000`端口即可。
```

打包构建

```bash
# 在生产环境下构建spa
freepress build
# 在生产环境下构建ssr并且声称静态html文件
freepress generate
```
