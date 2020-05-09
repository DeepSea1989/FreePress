const path = require('path');
module.exports = {
  base: process.env.base || '',
  title: 'freepress',
  locales: {
    '/zh/': {
      lang: 'zh-CN',
      title: 'freepress',
      description: '一个静态网站生成器，其UI是使用Ant Design构建的，并由React.js驱动'
    }
  },
  logo: '/favicon.png',
  head: [
    ['link', { rel: 'icon', href: `/favicon.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  serviceWorker: true,
  footer:
    'MIT Licensed | Copyright © 2020 <a target="_blank" href="https://github.com/DeepSea1989">DeepSea1989</a>',
  themeConfig: {
    repo: 'DeepSea1989/freepress',
    docsDir: 'packages/docs/docs',
    locales: {
      '/zh': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新于', // string | false
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '配置',
            link: '/zh/config/'
          },
          {
            text: '默认主题配置',
            link: '/zh/default-theme-config/'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/DeepSea1989/freepress',
            important: true
          }
        ],
        sidebar: {
          '/zh/guide/': getGuideSidebar('开始上手'),
          '/zh/config/': [''],
          '/zh/default-theme-config/': ['']
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './components')
      }
    }
  }
};

function getGuideSidebar(start = 'Get Started') {
  return [
    {
      title: start,
      collapsable: false,
      children: ['', 'getting-started']
    },
    'configuration',
    'theme',
    'usejsx',
    'markdown',
    'global-component',
    'i18n',
    'cli'
  ];
}
