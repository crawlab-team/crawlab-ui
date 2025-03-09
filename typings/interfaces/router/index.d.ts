import { RouteLocation, _RouteRecordBase, RouteComponent } from 'vue-router';

export declare global {
  interface CreateRouterOptions {
    routerAuth?: RouterAuthOptions;
    routerStats?: RouterStatsOptions;
  }

  interface ExtendedRouterRecord extends _RouteRecordBase {
    name?: string;
    title?: string;
    icon?: Icon;
    children?: Array<ExtendedRouterRecord>;
    redirect?: string | ((to: RouteLocation) => RouteLocation);
    path?: string;
    component?: RouteComponent;
    routeConcept?: RouteConcept;
  }

  type RouteConcept =
    | ListStoreNamespace
    | 'home'
    | 'notification'
    | 'permission'
    | 'ai'
    | 'system'
    | 'misc'
    | 'myAccount'
    | 'pat'
    | 'disclaimer';
}

export * from './auth';
