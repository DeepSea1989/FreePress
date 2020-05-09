'use strict';

/*
 * @author DeepSea1989
 */

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const createMarkdown = require('@freepress/markdown');
const loadConfig = require('./loadConfig');
const {
  encodePath,
  fileToPath,
  sort,
  getGitLastUpdatedTimeStamp,
  createResolveThemeLayoutPath,
  createResolvePathWithExts,
  getCompWithExt
} = require('./util');
const { inferTitle, logger } = require('@freepress/util');
const { omit } = require('lodash');

function isHome(frontmatter, path, themeConfig) {
  return (
    frontmatter.home === true &&
    ((themeConfig.locales && Object.keys(themeConfig.locales).indexOf(path) !== -1) || path === '/')
  );
}

module.exports = async function resolveOptions(sourceDir) {
  const freepressDir = path.resolve(sourceDir, '.freepress');
  const siteConfig = loadConfig(freepressDir);

  // normalize head tag urls for base
  const base = siteConfig.base || '/';
  if (base !== '/' && siteConfig.head) {
    siteConfig.head.forEach(tag => {
      const attrs = tag[1];
      if (attrs) {
        for (const name in attrs) {
          if (name === 'src' || name === 'href') {
            const value = attrs[name];
            if (value.charAt(0) === '/') {
              attrs[name] = base + '/' + value.slice(1);
            }
          }
        }
      }
    });
  }

  // resolve outDir
  const outDir = siteConfig.dest
    ? path.resolve(siteConfig.dest)
    : path.resolve(sourceDir, '.freepress/dist');

  // resolve theme
  const resolveThemeLayoutPath = createResolveThemeLayoutPath(sourceDir);
  const resolvePathWidthExts = createResolvePathWithExts(sourceDir);
  const useDefaultTheme = !siteConfig.theme && !fs.existsSync(path.resolve(freepressDir, 'theme'));
  const defaultThemeLayoutPath = resolveThemeLayoutPath('@freepress/theme-default');
  let themePath = null;
  let themeLayoutPath = null;
  let themeNotFoundPath = null;
  let themeEnhanceAppPath = null;

  if (useDefaultTheme) {
    // use default theme
    themePath = path.dirname(defaultThemeLayoutPath);
    themeLayoutPath = defaultThemeLayoutPath;
    themeNotFoundPath = resolvePathWidthExts(`${themePath}/NotFound`);
    // console.log('defaultThemePath:', defaultThemeLayoutPath);
  } else {
    // resolve theme Layout
    if (siteConfig.theme) {
      // use external theme
      try {
        themeLayoutPath = resolveThemeLayoutPath(siteConfig.theme);
        themePath = path.dirname(themeLayoutPath);
      } catch (e) {
        throw new Error(
          logger.Error(`Failed to load custom theme layout at theme "${siteConfig.theme}".`, false)
        );
      }
    } else {
      // use custom theme
      themePath = path.resolve(freepressDir, 'theme');
      themeLayoutPath = resolvePathWidthExts(`${themePath}/Layout`);
      if (!themeLayoutPath) {
        throw new Error(logger.error(`Cannot resolve Layout file in .freepress/theme`));
      }
    }

    // resolve theme NotFound
    themeNotFoundPath = resolvePathWidthExts(`${themePath}/NotFound`);
    if (!themeNotFoundPath) {
      themeNotFoundPath = resolvePathWidthExts(`${path.dirname(defaultThemeLayoutPath)}/NotFound`);
    }

    // console.log('customThemePath:', themeLayoutPath);
  }

  // resolve theme config
  const themeConfig = siteConfig.themeConfig || {};

  // resolve global component
  let globalComponentPath = getCompWithExt(path.resolve(sourceDir, '.freepress/globalComponent'));

  if (!globalComponentPath) {
    globalComponentPath = path.resolve(__dirname, '../../web/shared/noop.js');
  }

  // TODO Algolia supported
  // resolve algolia
  const isAlgoliaSearch = false;
  //   themeConfig.algolia ||
  //   Object.keys((siteConfig.locales && themeConfig.locales) || {}).some(
  //     base => themeConfig.locales[base].algolia
  //   );

  // resolve markdown
  const markdown = await createMarkdown(siteConfig);

  // resolve pageFiles
  const patterns = ['**/*.md', '**/*.mdx', '!.freepress', '!node_modules'];
  if (siteConfig.dest) {
    const outDirRelative = path.relative(sourceDir, outDir);
    if (!outDirRelative.includes('..')) {
      patterns.push('!' + outDirRelative);
    }
  }
  const pageFiles = sort(await globby(patterns, { cwd: sourceDir, nocase: true }));

  // resolve lastUpdated
  const shouldResolveLastUpdated =
    themeConfig.lastUpdated ||
    Object.keys((siteConfig.locales && themeConfig.locales) || {}).some(
      base => themeConfig.locales[base].lastUpdated
    );
  const docsDir = siteConfig.themeConfig.docsDir;

  // resolve pagesData
  const pagesData = await Promise.all(
    pageFiles.map(async file => {
      const filepath = path.resolve(sourceDir, file);

      const data = {
        path: encodePath(fileToPath(file)),
        filePath: path.join(docsDir, file)
      };

      if (shouldResolveLastUpdated) {
        data.lastUpdated = getGitLastUpdatedTimeStamp(filepath);
      }

      // extract yaml frontMatter
      const content = await fs.readFile(filepath, 'utf-8');
      const { headings, frontMatter, toc } = markdown(content);

      // infer title
      const title = inferTitle(frontMatter, headings);
      data.title = title || data.path;

      data.headings = headings || [];
      data.frontMatter = frontMatter.data || {};

      data.isWebsiteHome = isHome(data.frontMatter, data.path, siteConfig.themeConfig);

      if (frontMatter.excerpt) {
        const html = markdown.render(frontMatter.excerpt);
        data.excerpt = html;
      }

      data.toc = toc;
      data.avatarList = [];
      // get avatarList
      if (themeConfig.showAvatarList) {
        data.avatarList = await getAvatarList(themeConfig, file);
      }

      return data;
    })
  );

  // resolve site data
  const siteData = {
    title: siteConfig.title || path.dirname(sourceDir),
    ...omit(siteConfig, ['configureWebpack', 'chainWebpack']),
    pages: pagesData
  };

  // make tmp path
  const tempPath = path.resolve(sourceDir, '.freepress/.temp');
  fs.ensureDirSync(tempPath);

  // console.log('layoutPath:', themeLayoutPath);

  const options = {
    siteConfig,
    siteData,
    sourceDir,
    outDir,
    publicPath: base,
    pageFiles,
    pagesData,
    themePath,
    themeLayoutPath,
    themeNotFoundPath,
    themeEnhanceAppPath,
    globalComponentPath,
    useDefaultTheme,
    isAlgoliaSearch,
    markdown,
    tempPath
  };

  return options;
};

//  get AvatarList from github
const getAvatarList = async (themeConfig, filename) => {
  const sourcePath = `https://github.com/${themeConfig.docsRepo || themeConfig.repo}/contributors/${
    themeConfig.docsBranch
  }`;
  const fileCompeletePath = `${themeConfig.docsDir}/${filename}`.replace(/\/\//, '/');
  const url = `${sourcePath}/${fileCompeletePath}`;
  const html = await fetch(url, { timeout: 100000 })
    .then(res => res.text())
    .catch(e => {
      logger.error(e);
    });

  const $ = cheerio.load(html || '');
  const data = [];
  $('li a').map((index, ele) => {
    data.push({
      username: $(ele)
        .text()
        .trim(),
      url: $(ele)
        .children('img')
        .attr('src')
    });
    return false;
  });
  return data;
};
