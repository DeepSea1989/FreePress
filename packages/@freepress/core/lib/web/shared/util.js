/*
 * @author DeepSea1989
 */

export function getCurrentLoacle(siteData, path) {
  let targetLocale = '';

  const locales = siteData.themeConfig.locales;
  if (!locales) return siteData.base || '/';

  for (let locale in locales) {
    if (path != targetLocale && path.startsWith(locale)) {
      targetLocale = locale;
    }
  }

  return Object.keys(locales).length > 1 && targetLocale;
}

export function getcurrentLocaleConfigByPath(siteData, path) {
  const targetLocale = getCurrentLoacle(siteData, path);
  if (!siteData.themeConfig.locales) {
    return {
      locale: targetLocale,
      currentLocaleSiteData: siteData
    };
  }

  return {
    targetLocale,
    locale: targetLocale,
    currentLocaleSiteData: {
      ...siteData,
      ...siteData.locales[targetLocale],
      themeConfig: {
        ...siteData.themeConfig,
        ...siteData.themeConfig.locales[targetLocale]
      }
    }
  };
}

function resolvePath(relative, base, append = '') {
  const firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative;
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative;
  }

  const stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/');
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

export function resolveSidebarItems(siteData, currentPath) {
  const { pages } = siteData;
  const { currentLocaleSiteData, targetLocale } = getcurrentLocaleConfigByPath(
    siteData,
    currentPath
  );

  const pageSidebarConfig = currentLocaleSiteData.themeConfig.sidebar;

  let currentPageSidebarItems = [];
  let allPagesSidebarItems = [];

  if (!pageSidebarConfig) {
    return {
      currentPageSidebarItems,
      allPagesSidebarItems
    };
  } else {
    allPagesSidebarItems = Object.keys(pageSidebarConfig).reduce((pre, cur) => {
      const resolvedConfig = resolvePageSidebar(pageSidebarConfig[cur], cur, pages);

      if (currentPath.startsWith(cur)) {
        currentPageSidebarItems = resolvedConfig;
      }

      return pre.concat(resolvedConfig);
    }, []);

    return {
      targetLocale,
      currentPageSidebarItems,
      allPagesSidebarItems
    };
  }
}
function resolvePageSidebar(config, path, pages) {
  return config ? config.map(item => resolveItem(item, pages, path, 1)) : [];
}

function resolveItem(item, pages, base, nestedLevel) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base);
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    });
  } else {
    if (nestedLevel > 2) {
      console.error('[FreePress] Currently FreePress sidebar only support max two levels nested. ');

      return null;
    }

    const children = item.children || [];
    return {
      title: item.title,
      children: children.map(child => resolveItem(child, pages, base, nestedLevel + 1)),
      collapsable: item.collapsable !== false
    };
  }
}

export function resolvePage(pages, rawPath, base) {
  if (base) {
    rawPath = resolvePath(rawPath, base);
  }
  const path = normalize(rawPath);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (normalize(page.path) === path) {
      return {
        children: [],
        ...page
      };
    }
  }

  console.error(`[FreePress] No matching page found for sidebar item "${rawPath}"`);
  return {
    children: [],
    title: rawPath,
    path: rawPath,
    toc: {
      items: []
    }
  };
}

export const hashRE = /#.*$/;
export const extRE = /\.(mdx?|html)$/;
export const outboundRE = /^(https?:|mailto:|tel:)/;
export const endingSlashRE = /\/$/;

export function normalize(path) {
  return decodeURI(path)
    .replace(hashRE, '')
    .replace(extRE, '');
}

export function getCurrentPage(pages, routes, curPath) {
  const page = pages.find(p => p.path == curPath) || {};
  const route = routes.find(p => p.path == curPath);

  page.Markdown = (route || {}).markdown;

  return page;
}
