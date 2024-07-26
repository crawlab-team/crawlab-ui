import { RouteLocation, _RouteRecordBase, RouteComponent } from 'vue-router';

export declare global {
  interface CreateRouterOptions {
    routerAuth?: RouterAuthOptions;
    routerStats?: RouterStatsOptions;
  }

  interface ExtendedRouterRecord extends _RouteRecordBase {
    name: string;
    title: string;
    icon?: Icon;
    children?: Array<ExtendedRouterRecord>;
    redirect?: (to: RouteLocation) => RouteLocation;
    path?: string;
    component?: RouteComponent;
  }
}

export * from './auth';
