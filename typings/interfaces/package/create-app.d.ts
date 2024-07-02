import { RouteRecordRaw } from 'vue-router';
import { Store } from 'vuex';

export declare global {
  interface CreateAppOptions {
    initBaiduTongji?: boolean;
    initClarity?: boolean;
    initDemo?: boolean;
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
    rootRoutes?: Array<RouteRecordRaw>;
    routes?: Array<RouteRecordRaw>;
    allRoutes?: Array<RouteRecordRaw>;
    createRouterOptions?: CreateRouterOptions;
  }
}
