import { Store } from 'vuex';

export declare global {
  interface CreateAppOptions {
    initBaiduTongji?: boolean;
    initClarity?: boolean;
    mount?: boolean | string;
    store?: Store;
    rootRoutes?: Array<ExtendedRouterRecord>;
    routes?: Array<ExtendedRouterRecord>;
    allRoutes?: Array<ExtendedRouterRecord>;
    createRouterOptions?: CreateRouterOptions;
  }
}
