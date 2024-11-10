import { Router } from 'vue-router';
import urljoin from 'url-join';
import { getStore } from '@/store';
import { getDefaultRoutes } from '@/router';
import { normalizeTree } from '@/utils/tree';

const routePathRegex = /(\/[\w\/-]+)\/([0-9a-f]{24})\/([\w-]+)/i;

export const getRoutePath = (path: string) => {
  if (routePathRegex.test(path)) {
    return path.match(routePathRegex)![1];
  }
  const arr = path.split('/');
  if (arr.length < 3) return '';
  return arr.slice(0, 3).join('/');
};

export const getTabName = (router?: Router) => {
  if (!router) return '';
  if (routePathRegex.test(router.currentRoute.value.path)) {
    return router.currentRoute.value.path.match(routePathRegex)![3];
  }
  const arr = router.currentRoute.value.path.split('/');
  if (arr.length < 3) return '';
  return arr[3];
};

export const getPrimaryPath = (path: string): string => {
  if (routePathRegex.test(path)) {
    return path.match(routePathRegex)![1];
  }
  const arr = path.split('/');
  if (arr.length <= 1) {
    return path;
  } else {
    return `/${arr[1]}`;
  }
};

export const getRouteMenuItems = (): MenuItem[] => {
  const routes = getDefaultRoutes();
  const normalizedRoutes = normalizeTree<ExtendedRouterRecord>(
    routes,
    (parentNode, node) => {
      return {
        ...node,
        path: urljoin(parentNode.path as string, node.path as string),
      };
    }
  );
  return normalizedRoutes.map(r => {
    return {
      title: r.title || '',
      icon: r.icon,
      path: r.path,
    } as MenuItem;
  });
};

export const getRouteMenuItemsMap = () => {
  const menuItems = [...getRouteMenuItems()];
  const map = new Map<string, MenuItem>();
  for (const item of menuItems) {
    map.set(item.path || '', item);
  }
  return map;
};

export const getNavMenuItems = (path: string): MenuItem[] => {
  const menuItemsMap = getRouteMenuItemsMap();
  const normalizedPath = path.replace(/[0-9a-f]{24}/, ':id');
  const pathParts = normalizedPath.split('/');
  const menuItems: MenuItem[] = [];
  for (let i = 1; i <= pathParts.length; i++) {
    const subPath = pathParts.slice(0, i).join('/');
    const menuItem = menuItemsMap.get(subPath);
    if (menuItem?.title) {
      menuItems.push(menuItemsMap.get(subPath)!);
    }
  }
  return menuItems;
};

export const getMenuItemPathMap = (
  rootPath: string,
  item: MenuItem
): Map<string, string> => {
  const paths = new Map<string, string>();
  const itemPath = item.path?.startsWith('/')
    ? item.path
    : urljoin(rootPath, item.path || '');
  paths.set(itemPath, rootPath);
  if (item.children && item.children.length > 0) {
    for (const subItem of item.children) {
      getMenuItemPathMap(itemPath, subItem).forEach((parentPath, path) => {
        paths.set(path, parentPath);
      });
    }
  }
  return paths;
};

export const getAllMenuItemPathMap = () => {
  const store = getStore();
  const paths = new Map<string, string>();
  for (const item of store.getters['layout/sidebarMenuItems'] as MenuItem[]) {
    getMenuItemPathMap('/', item).forEach((parentPath, path) => {
      paths.set(path, parentPath);
    });
  }
  return paths;
};

export const getRouteSelectOptions = (): SelectOption[] => {
  const routes: Array<ExtendedRouterRecord> =
    getDefaultRoutes().find(r => r.path === '/')?.children || [];
  return routes.map(r => {
    console.debug(r);
    return {
      value: r.path || '',
      label: r.title || '',
      children: r.children?.map(c => {
        return {
          value: c.path || '',
          label: c.title || '',
        };
      }),
    };
  });
};
