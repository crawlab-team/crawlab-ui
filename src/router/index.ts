import {
  createRouter as createVueRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router';
import login from '@/router/login';
import home from '@/router/home';
import node from '@/router/node';
import project from '@/router/project';
import spider from '@/router/spider';
import task from '@/router/task';
import schedule from '@/router/schedule';
import user from '@/router/user';
import token from '@/router/token';
import deps from '@/router/deps';
import notification from '@/router/notification';
import git from '@/router/git';
import database from '@/router/database';
import dependency from '@/router/dependency';
import environment from '@/router/environment';
import system from '@/router/system';
import misc from '@/router/misc';
import { initRouterAuth } from '@/router/hooks/auth';
import { ROUTER_ROOT_NAME_ROOT } from '@/constants/router';
import { ClNormalLayout } from '@/layouts';

export function getDefaultRoutes(): Array<ExtendedRouterRecord> {
  return [
    ...login,
    {
      path: '/',
      redirect: '/home',
      name: ROUTER_ROOT_NAME_ROOT,
      component: async () => ClNormalLayout,
      children: [
        ...home,
        ...node,
        ...project,
        ...spider,
        ...task,
        ...schedule,
        ...user,
        ...token,
        ...deps,
        ...notification,
        ...git,
        ...database,
        ...dependency,
        ...environment,
        ...system,
        ...misc,
      ],
    },
  ];
}

export function getDefaultSidebarMenuItems(): MenuItem[] {
  return [
    { path: '/home', title: 'router.menuItems.home', icon: ['fa', 'home'] },
    { path: '/nodes', title: 'router.menuItems.nodes', icon: ['fa', 'server'] },
    {
      path: '/projects',
      title: 'router.menuItems.projects',
      icon: ['fa', 'project-diagram'],
    },
    {
      path: '/spiders',
      title: 'router.menuItems.spiders',
      icon: ['fa', 'spider'],
    },
    {
      path: '/schedules',
      title: 'router.menuItems.schedules',
      icon: ['fa', 'clock'],
    },
    { path: '/tasks', title: 'router.menuItems.tasks', icon: ['fa', 'tasks'] },
    { path: '/gits', title: 'router.menuItems.git', icon: ['fab', 'git'] },
    {
      path: '/databases',
      title: 'router.menuItems.databases',
      icon: ['fa', 'database'],
    },
    { path: '/users', title: 'router.menuItems.users', icon: ['fa', 'users'] },
    { path: '/tokens', title: 'router.menuItems.tokens', icon: ['fa', 'key'] },
    {
      path: '/deps',
      title: 'router.menuItems.env.deps.title',
      icon: ['fa', 'puzzle-piece'],
      children: [
        {
          path: '/deps/settings',
          title: 'router.menuItems.env.deps.settings',
          icon: ['fa', 'cog'],
        },
        {
          path: '/deps/python',
          title: 'router.menuItems.env.deps.python',
          icon: ['fab', 'python'],
        },
        {
          path: '/deps/node',
          title: 'router.menuItems.env.deps.node',
          icon: ['fab', 'node'],
        },
      ],
    },
    {
      path: '/dependencies',
      title: 'router.menuItems.dependencies',
      icon: ['fa', 'cubes'],
    },
    {
      path: '/notifications',
      title: 'router.menuItems.notification.title',
      icon: ['fa', 'envelope'],
      children: [
        {
          path: '/notifications/settings',
          title: 'router.menuItems.notification.settings',
          icon: ['fa', 'cog'],
        },
        {
          path: '/notifications/channels',
          title: 'router.menuItems.notification.channels',
          icon: ['fa', 'broadcast-tower'],
        },
        {
          path: '/notifications/alerts',
          title: 'router.menuItems.notification.alerts',
          icon: ['fa', 'bell'],
        },
        {
          path: '/notifications/requests',
          title: 'router.menuItems.notification.requests',
          icon: ['fa', 'paper-plane'],
        },
      ],
    },
    {
      path: '/environments',
      title: 'router.menuItems.environment',
      icon: ['fa', 'percent'],
    },
    { path: '/system', title: 'router.menuItems.system', icon: ['fa', 'cogs'] },
  ];
}

export function getDefaultHiddenMenuItems(): MenuItem[] {
  const items = [
    {
      path: '/misc/disclaimer',
      title: 'router.menuItems.misc.disclaimer',
      icon: ['fa', 'file-signature'],
    },
    {
      path: '/misc/my-settings',
      title: 'router.menuItems.misc.mySettings',
      icon: ['fa', 'user-cog'],
    },
  ] as MenuItem[];
  return items.map(d => {
    d.hidden = true;
    return d;
  });
}

export function getDefaultMenuItems(): MenuItem[] {
  return [...getDefaultSidebarMenuItems(), ...getDefaultHiddenMenuItems()];
}

export function getRootRoute(
  routes: Array<ExtendedRouterRecord>
): ExtendedRouterRecord | undefined {
  return routes.find(r => r.name === ROUTER_ROOT_NAME_ROOT);
}

export function getRouteByName(
  routes: Array<ExtendedRouterRecord>,
  name: string
): ExtendedRouterRecord | undefined {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    }
    if (route.children) {
      const subRoute = getRouteByName(route.children, name);
      if (subRoute) {
        return subRoute;
      }
    }
  }
  return;
}

export function replaceRouteByName(
  routes: Array<ExtendedRouterRecord>,
  name: string,
  component: any
) {
  const route = getRouteByName(routes, name);
  if (route) {
    route.component = component;
  }
}

export function addRoutes(
  route: ExtendedRouterRecord,
  routes: Array<ExtendedRouterRecord>
): void {
  if (!route.children) {
    route.children = [];
  }
  route.children = route.children.concat(routes);
}

export function createRouter(
  rootRoutes?: Array<ExtendedRouterRecord>,
  routes?: Array<ExtendedRouterRecord>,
  allRoutes?: Array<ExtendedRouterRecord>,
  options?: CreateRouterOptions
): Router {
  // all routes
  if (!allRoutes) {
    allRoutes = getDefaultRoutes();
  }

  // add routes
  if (routes) {
    allRoutes = allRoutes.concat(routes);
  }

  // add root routes
  if (rootRoutes) {
    const rootRoute = getRootRoute(allRoutes);
    if (rootRoute) {
      addRoutes(rootRoute, rootRoutes);
    }
  }

  // history
  const history = createWebHashHistory((import.meta as any).env.BASE_URL);

  // router
  const router = createVueRouter({
    history,
    routes: allRoutes as RouteRecordRaw[],
  });

  // initialize
  initRouterAuth(router, options?.routerAuth);

  return router;
}

let _router: Router;

export function getRouter(
  rootRoutes?: Array<ExtendedRouterRecord>,
  routes?: Array<ExtendedRouterRecord>,
  allRoutes?: Array<ExtendedRouterRecord>,
  options?: CreateRouterOptions
): Router {
  if (!_router) {
    _router = createRouter(rootRoutes, routes, allRoutes, options);
  }
  return _router;
}
