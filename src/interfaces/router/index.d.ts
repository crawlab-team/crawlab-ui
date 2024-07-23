import { RouteRecordRaw } from 'vue-router';

export declare global {
  interface CreateRouterOptions {
    routerAuth?: RouterAuthOptions;
    routerStats?: RouterStatsOptions;
  }

  interface ExtendedRouterRecord extends RouteRecordRaw {
    title: string;
    icon?: Icon;
    children?: Array<ExtendedRouterRecord>;
    path?: string;
  }
}

export * from './auth';
