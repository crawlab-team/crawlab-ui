import { RouteRecordRaw } from 'vue-router';
import { Store } from 'vuex';

export declare global {
  interface CreateAppOptions {
    initBaiduTongji?: boolean;
    initClarity?: boolean;
    loadStore?: boolean;
    loadRouter?: boolean;
    loadElementPlus?: boolean;
    loadCrawlabUI?: boolean;
    loadI18n?: boolean;
    loadFontAwesome?: boolean;
    loadLocate?: boolean;
    loadAuth?: boolean;
    loadExport?: boolean;
    mount?: boolean | string;
    store?: Store;
    rootRoutes?: Array<ExtendedRouterRecord>;
    routes?: Array<ExtendedRouterRecord>;
    allRoutes?: Array<ExtendedRouterRecord>;
    createRouterOptions?: CreateRouterOptions;
  }
}
