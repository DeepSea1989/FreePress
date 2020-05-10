  <p align="center"><img width="100" src="https://pan.isdefined.com/view/ImageHost/content/logo.png" /></p>

<h1 align="center">FreePress</h1>
<p align="center">
一款使用Ant Design构建，由React.js驱动的静态网站生成器.  🎨
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/freepress/"><img src="https://img.shields.io/npm/v/freepress.svg" alt="Version"></a><a href="https://circleci.com/gh/DeepSea1989/freepress/tree/master"><img src="https://circleci.com/gh/DeepSea1989/freepress/tree/master.png?style=shield" alt="Build Status"></a> 
  <a href="https://www.npmjs.com/package/freepress"><img src="https://img.shields.io/npm/l/freepress.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/freepress"><img src="https://img.shields.io/npm/dm/freepress.svg" alt="Download"></a>
<a href="https://github.com/DeepSea1989/freepress"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>


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



## 感谢

- [Ant Design](https://ant.design/)
- [VuePress](https://vuepress.vuejs.org/)
- [GatsbyJs](https://www.gatsbyjs.org/)
- [RcPress](https://www.yvescoding.com/)
