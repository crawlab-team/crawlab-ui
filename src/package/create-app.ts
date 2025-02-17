import { createApp, App } from 'vue';
import ElementPlus from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { installer as CrawlabUI } from '@/package/index';
import AppComp from './App.vue';
import { getStore } from '@/store';
import { getI18n } from '@/i18n';
import { initBaiduTonji } from '@/admin/baidu';
import { getRouter } from '@/router';
import { initRequest } from '@/services/request';
import { setGlobalLang } from '@/utils/i18n';
import { auth, export_ } from '@/directives';
import { initClarity } from '@/admin/clarity';
import 'normalize.css/normalize.css';
import 'element-plus/theme-chalk/index.css';
import '@/styles/index.css';
import { initChartJS } from '@/utils/chart';
import { initMonaco } from '@/utils/monaco';
import clickOutsideDirective from '@/directives/click-outside/clickOutside';

export const getDefaultCreateAppOptions = (): CreateAppOptions => {
  return {
    initBaiduTongji: true,
    initClarity: false,
    store: undefined,
    rootRoutes: undefined,
    routes: undefined,
    allRoutes: undefined,
  };
};

export const normalizeOptions = (
  options: CreateAppOptions
): CreateAppOptions => {
  return options;
};

const _createApp = async (options?: CreateAppOptions): Promise<App> => {
  // merge options
  options = {
    ...getDefaultCreateAppOptions(),
    ...options,
  };

  // normalize options
  options = normalizeOptions(options);

  // baidu tongji
  if (options.initBaiduTongji) initBaiduTonji();

  // clarity
  if (options.initClarity) initClarity();

  // remove loading placeholder
  document.querySelector('#loading-placeholder')?.remove();

  // store
  const store = options.store || getStore();

  // router
  const router = getRouter(
    options.rootRoutes,
    options.routes,
    options.allRoutes,
    options.createRouterOptions
  );

  // app
  const app = createApp(AppComp);

  // initialize request
  initRequest(router);

  // initialize chart.js
  initChartJS();

  // initialize monaco
  initMonaco();

  // load modules
  app.use(ElementPlus as any);
  app.use(CrawlabUI as any);
  app.use(store as any);
  app.use(router as any);
  app.use(getI18n() as any);
  setGlobalLang((window.localStorage.getItem('lang') as Lang) || 'en');
  app.component('font-awesome-icon', FontAwesomeIcon);
  app.directive('auth', auth as any);
  app.directive('click-outside', clickOutsideDirective);

  // mount
  app.mount(typeof options.mount === 'string' ? options.mount : '#app');

  return app;
};

export default _createApp;
