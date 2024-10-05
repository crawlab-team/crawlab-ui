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

const endpoint = 'databases';

export default [
  {
    name: 'DatabaseList',
    path: endpoint,
    title: t('layouts.routes.databases.title'),
    icon: ['fa', 'database'],
    component: async () => ClDatabaseList,
  },
  {
    name: 'DatabaseDetail',
    path: `${endpoint}/:id`,
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClDatabaseDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.databases.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClDatabaseDetailTabOverview,
      },
      {
        path: TAB_NAME_DATABASES,
        title: t('layouts.routes.databases.tabs.databases'),
        icon: getIconByTabName(TAB_NAME_DATABASES),
        component: async () => ClDatabaseDetailTabDatabases,
      },
      {
        path: TAB_NAME_CONSOLE,
        title: t('layouts.routes.databases.tabs.console'),
        icon: getIconByTabName(TAB_NAME_CONSOLE),
        component: async () => ClDatabaseDetailTabConsole,
      },
      {
        path: TAB_NAME_MONITORING,
        title: t('layouts.routes.databases.tabs.monitoring'),
        icon: getIconByTabName(TAB_NAME_MONITORING),
        component: async () => ClDatabaseDetailTabMonitoring,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
