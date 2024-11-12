import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_DATABASES,
  TAB_NAME_CONSOLE,
  TAB_NAME_MONITORING,
} from '@/constants';
import {
  ClDatabaseDetail,
  ClDatabaseDetailTabOverview,
  ClDatabaseDetailTabDatabases,
  ClDatabaseDetailTabConsole,
  ClDatabaseDetailTabMonitoring,
  ClDatabaseList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/databases';

export default [
  {
    routeConcept: 'database',
    name: 'DatabaseList',
    path: endpoint,
    title: t('layouts.routes.databases.list.title'),
    component: async () => ClDatabaseList,
  },
  {
    routeConcept: 'database',
    name: 'DatabaseDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.databases.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClDatabaseDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.databases.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClDatabaseDetailTabOverview,
      },
      {
        path: TAB_NAME_DATABASES,
        title: t('layouts.routes.databases.detail.tabs.databases'),
        icon: getIconByTabName(TAB_NAME_DATABASES),
        component: async () => ClDatabaseDetailTabDatabases,
      },
      {
        path: TAB_NAME_CONSOLE,
        title: t('layouts.routes.databases.detail.tabs.console'),
        icon: getIconByTabName(TAB_NAME_CONSOLE),
        component: async () => ClDatabaseDetailTabConsole,
      },
      {
        path: TAB_NAME_MONITORING,
        title: t('layouts.routes.databases.detail.tabs.monitoring'),
        icon: getIconByTabName(TAB_NAME_MONITORING),
        component: async () => ClDatabaseDetailTabMonitoring,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
