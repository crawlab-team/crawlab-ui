import { Router } from 'vue-router';

export declare function getDefaultRoutes(): Array<ExtendedRouterRecord>;
export declare function getDefaultSidebarMenuItems(): MenuItem[];
export declare function getDefaultHiddenMenuItems(): MenuItem[];
export declare function getDefaultMenuItems(): MenuItem[];

export declare function getRootRoute(
  routes: Array<ExtendedRouterRecord>
): ExtendedRouterRecord | undefined;

export declare function getRouteByName(
  routes: Array<ExtendedRouterRecord>,
  name: string
): ExtendedRouterRecord | undefined;

export declare function replaceRouteByName(
  routes: Array<ExtendedRouterRecord>,
  name: string,
  component: any
): void;

export declare function addRoutes(
  route: ExtendedRouterRecord,
  routes: Array<ExtendedRouterRecord>
): void;

export declare function createRouter(
  rootRoutes?: Array<ExtendedRouterRecord>,
  routes?: Array<ExtendedRouterRecord>,
  allRoutes?: Array<ExtendedRouterRecord>,
  options?: CreateRouterOptions
): Router;

export declare function getRouter(
  rootRoutes?: Array<ExtendedRouterRecord>,
  routes?: Array<ExtendedRouterRecord>,
  allRoutes?: Array<ExtendedRouterRecord>,
  options?: CreateRouterOptions
): Router;
