import { Router } from 'vue-router';
import urljoin from 'url-join';
import { getStore } from '@/store';
import { getDefaultRoutes } from '@/router';
import { normalizeTree } from '@/utils/tree';
import { getIconByRouteConcept } from '@/utils/icon';
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
        routeConcept: parentNode.routeConcept || node.routeConcept,
      };
    }
  );
  return normalizedRoutes.map(r => {
    return {
      title: r.title || '',
      icon: r.icon,
      path: r.path,
      routeConcept: r.routeConcept,
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
  const pathParts = path.split('/');
  const normalizedPath = path.replace(/[0-9a-f]{24}/, ':id');
  const normalizedPathParts = normalizedPath.split('/');
  const menuItems: MenuItem[] = [];
  for (let i = 1; i <= normalizedPathParts.length; i++) {
    const subPath = pathParts.slice(0, i).join('/');
    const normalizedSubPath = normalizedPathParts.slice(0, i).join('/');
    const menuItem = menuItemsMap.get(normalizedSubPath);
    if (menuItem?.title) {
      menuItems.push({
        ...menuItem,
        path: subPath,
      });
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

export const getRouteSelectOptions = (): CheckboxTreeSelectOption[] => {
  const routes: Array<ExtendedRouterRecord> =
    getDefaultRoutes().find(r => r.path === '/')?.children || [];

  // Group routes by routeConcept
  const conceptGroups = new Map<RouteConcept, ExtendedRouterRecord[]>();
  routes.forEach(route => {
    // Get concept
    let concept = route.routeConcept;

    // Skip if no concept
    if (!concept) return;

    // Special case for notifications
    if (concept === 'notification') return;
    if (concept.startsWith('notification')) {
      concept = 'notification';
    }

    // Add to concept group
    if (!conceptGroups.has(concept)) {
      conceptGroups.set(concept, []);
    }
    conceptGroups.get(concept)?.push(route);
  });

  return Array.from(conceptGroups.entries()).map(([concept, conceptRoutes]) => {
    // Initialize variables
    let value: string | undefined = undefined;
    let children: CheckboxTreeSelectOption[] | undefined = conceptRoutes.map(
      r => {
        let value: string | undefined = r.path;
        let children: CheckboxTreeSelectOption[] | undefined;
        children = r.children?.map(c => {
          return {
            id: JSON.stringify([concept, r.path, c.path]),
            icon:
              c.icon ||
              getIconByRouteConcept(c.routeConcept!) ||
              r.icon ||
              getIconByRouteConcept(r.routeConcept!),
            label: c.title || '',
            value: r.path + '/' + c.path,
            labelWidth: 'auto',
          } as CheckboxTreeSelectOption;
        });
        if (children && children.length === 1) {
          value = children[0].value;
          children = undefined;
        }
        return {
          id: JSON.stringify([concept, r.path]),
          icon: r.icon || getIconByRouteConcept(r.routeConcept!),
          label: r.title || '',
          value,
          horizontal: true,
          children,
        };
      }
    );

    // Special cases
    if (
      [
        'home',
        'dependency',
        'system',
        'myAccount',
        'pat',
        'disclaimer',
      ].includes(concept)
    ) {
      children = undefined;
      value = conceptRoutes[0].path;
    } else if (concept === 'notification') {
      children = children.filter(c => c.value !== '/notifications');
    }

    return {
      id: JSON.stringify([concept]),
      icon: getIconByRouteConcept(concept),
      label: getLabelByRouteConcept(concept),
      value,
      children,
    };
  });
};

export const getLabelByRouteConcept = (concept: RouteConcept): string => {
  switch (concept) {
    case 'home':
      return t('router.menuItems.home');
    case 'node':
      return t('router.menuItems.nodes');
    case 'project':
      return t('router.menuItems.projects');
    case 'spider':
      return t('router.menuItems.spiders');
    case 'schedule':
      return t('router.menuItems.schedules');
    case 'task':
      return t('router.menuItems.tasks');
    case 'git':
      return t('router.menuItems.git');
    case 'database':
      return t('router.menuItems.databases');
    case 'user':
      return t('router.menuItems.users');
    case 'role':
      return t('router.menuItems.permissions.children.roles');
    case 'token':
      return t('router.menuItems.tokens');
    case 'dependency':
      return t('router.menuItems.dependencies');
    case 'environment':
      return t('router.menuItems.environment');
    case 'notification':
      return t('router.menuItems.notification.title');
    case 'notificationSetting':
      return t('router.menuItems.notification.settings');
    case 'notificationChannel':
      return t('router.menuItems.notification.channels');
    case 'notificationRequest':
      return t('router.menuItems.notification.requests');
    case 'notificationAlert':
      return t('router.menuItems.notification.alerts');
    case 'system':
      return t('router.menuItems.system');
    case 'misc':
      return t('router.menuItems.misc.title');
    case 'myAccount':
      return t('router.menuItems.misc.children.myAccount');
    case 'pat':
      return t('router.menuItems.misc.children.pat');
    case 'disclaimer':
      return t('router.menuItems.misc.children.disclaimer');
    default:
      return '';
  }
};
