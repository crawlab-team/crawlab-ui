import { Router } from 'vue-router';
import { getStore } from '@/store';
import urljoin from 'url-join';
import {
  TAB_NAME_CHANGES,
  TAB_NAME_CHANNELS,
  TAB_NAME_COLUMNS,
  TAB_NAME_CONSOLE,
  TAB_NAME_DATA,
  TAB_NAME_DATABASES,
  TAB_NAME_DEPENDENCIES,
  TAB_NAME_FILES,
  TAB_NAME_GIT,
  TAB_NAME_INDEXES,
  TAB_NAME_LOGS,
  TAB_NAME_MAIL,
  TAB_NAME_MONITORING,
  TAB_NAME_OUTPUT,
  TAB_NAME_OVERVIEW,
  TAB_NAME_PERMISSIONS,
  TAB_NAME_RESULTS,
  TAB_NAME_ROLES,
  TAB_NAME_SCHEDULES,
  TAB_NAME_SETTINGS,
  TAB_NAME_SPIDERS,
  TAB_NAME_TABLE,
  TAB_NAME_TASKS,
  TAB_NAME_TEMPLATE,
  TAB_NAME_TRIGGERS,
  TAB_NAME_USERS,
} from '@/constants';
import { getDefaultRoutes } from '@/router';
import { normalizeTree } from '@/utils/tree';
import { translate } from '@/utils/i18n';

const t = translate;

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

const getExtraMenuItems = (): MenuItem[] => {
  return [
    {
      title: t('layouts.routes.roles.title'),
      icon: ['fa', 'user-lock'],
      path: '/roles',
    },
    {
      title: t('layouts.routes.roles.tabs.overview'),
      icon: getIconByTabName(TAB_NAME_OVERVIEW) as any,
      path: '/roles/:id/overview',
    },
    {
      title: t('layouts.routes.roles.tabs.permissions'),
      icon: getIconByTabName(TAB_NAME_PERMISSIONS) as any,
      path: '/roles/:id/permissions',
    },
    {
      title: t('layouts.routes.roles.tabs.users'),
      icon: getIconByTabName(TAB_NAME_USERS) as any,
      path: '/roles/:id/users',
    },
    {
      title: t('layouts.routes.permissions.title'),
      icon: ['fa', 'user-lock'],
      path: '/permissions',
    },
    {
      title: t('layouts.routes.permissions.tabs.overview'),
      icon: getIconByTabName(TAB_NAME_OVERVIEW) as any,
      path: '/permissions/:id/overview',
    },
    {
      title: t('layouts.routes.permissions.tabs.roles'),
      icon: getIconByTabName(TAB_NAME_ROLES) as any,
      path: '/permissions/:id/roles',
    },
  ];
};

export const getRouteMenuItemsMap = () => {
  const menuItems = [...getRouteMenuItems(), ...getExtraMenuItems()];
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

export const getIconByTabName = (tabName: string): Icon => {
  switch (tabName) {
    case TAB_NAME_OVERVIEW:
      return ['fa', 'tachometer-alt'];
    case TAB_NAME_FILES:
      return ['fa', 'file-code'];
    case TAB_NAME_GIT:
      return ['fa', 'code-branch'];
    case TAB_NAME_TASKS:
      return ['fa', 'tasks'];
    case TAB_NAME_SETTINGS:
      return ['fa', 'cog'];
    case TAB_NAME_SPIDERS:
      return ['fa', 'spider'];
    case TAB_NAME_DATA:
      return ['fa', 'table'];
    case TAB_NAME_SCHEDULES:
      return ['fa', 'calendar-alt'];
    case TAB_NAME_LOGS:
      return ['fa', 'file-alt'];
    case TAB_NAME_DEPENDENCIES:
      return ['fa', 'cubes'];
    case TAB_NAME_TRIGGERS:
      return ['fa', 'bolt'];
    case TAB_NAME_TEMPLATE:
      return ['fa', 'file-code'];
    case TAB_NAME_CHANGES:
      return ['fa', 'code-commit'];
    case TAB_NAME_MONITORING:
      return ['fa', 'line-chart'];
    case TAB_NAME_CHANNELS:
      return ['fa', 'broadcast-tower'];
    case TAB_NAME_MAIL:
      return ['fa', 'at'];
    case TAB_NAME_DATABASES:
      return ['fa', 'database'];
    case TAB_NAME_CONSOLE:
      return ['fa', 'terminal'];
    case TAB_NAME_TABLE:
      return ['fa', 'table'];
    case TAB_NAME_COLUMNS:
      return ['fa', 'columns'];
    case TAB_NAME_INDEXES:
      return ['fa', 'list-ol'];
    case TAB_NAME_RESULTS:
      return ['fa', 'table'];
    case TAB_NAME_OUTPUT:
      return ['fa', 'file-alt'];
    case TAB_NAME_USERS:
      return ['fa', 'users'];
    case TAB_NAME_ROLES:
      return ['fa', 'user-lock'];
    case TAB_NAME_PERMISSIONS:
      return ['fa', 'user-check'];
    default:
      return ['fa', 'circle'];
  }
};

export const getIconByNavItem = (item: NavItem): Icon => {
  return getIconByTabName(item.id);
};
