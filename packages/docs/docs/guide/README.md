import './introduction.less'

# 介绍

- FreePress 是一个基于 React.js 的静态文档生成器。
- 使用 [Ant Design](https://ant.design/)设计构建， 并且它的配置项借鉴了[Vuepress](https://vuepress.vuejs.org/)

import ImgWidthBase from '@components/ImgWidthBase'

<div className="pic-plus">
  <ImgWidthBase url="antd-icon.svg" width={120} />
   <span>+</span>
  <ImgWidthBase url="react-icon.svg" width={120}/> 
</div>

## 特点

- 只需要简单配置和会一些 markdown 知识就能快速上手，熟悉[Vuepress](https://vuepress.vuejs.org/)的用户使用起来更是得心应手
- 支持用 markdown 语法渲染成常用的 Ant Design 组件，如[Alert]()
- 支支持[mdx](https://github.com/mdx-js/mdx) ,支持[自定义布局]()(例如自定义网站头部，底部， 首页等)

## 技术栈

- [Ant Design](https://ant.design/docs/react/introduce-cn)
- markdown
- [mdx](https://github.com/mdx-js/mdx)
- [React](https://reactjs.org/)

## 支持环境

- 现代浏览器和 IE11。
- 支持服务端渲染。

## 版本

- freepress 版本：[![npm package](https://img.shields.io/npm/v/@freepress/core.svg?style=flat-square)](https://www.npmjs.org/package/@freepress/core.svg)
