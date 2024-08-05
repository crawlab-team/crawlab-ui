import { Router } from 'vue-router';

export declare const getRoutePath: (path: string) => string;
export declare const getTabName: (router?: Router) => string;
export declare const getPrimaryPath: (path: string) => string;
export declare const getRouteMenuItems: () => MenuItem[];
export declare const getRouteMenuItemsMap: () => Map<string, MenuItem>;
export declare const getNavMenuItems: (path: string) => MenuItem[];
export declare const getMenuItemPathMap: (
  rootPath: string,
  item: MenuItem
) => Map<string, string>;
export declare const getAllMenuItemPathMap: () => Map<string, string>;
export declare const getIconByTabName: (tabName: string) => Icon;
export declare const getIconByNavItem: (item: NavItem) => Icon;
