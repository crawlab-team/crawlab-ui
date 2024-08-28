import {
  TAB_NAME_COLUMNS,
  TAB_NAME_CONSOLE,
  TAB_NAME_DATA,
  TAB_NAME_DATABASES,
  TAB_NAME_INDEXES,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TABLE,
} from '@/constants';
import {
  ClDatabaseDetail,
  ClDatabaseDetailTabConsole,
  ClDatabaseDetailTabDatabases,
  ClDatabaseDetailTabDatabasesSubTabColumns,
  ClDatabaseDetailTabDatabasesSubTabData,
  ClDatabaseDetailTabDatabasesSubTabIndexes,
  ClDatabaseDetailTabOverview,
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
        children: [
          {
            path: TAB_NAME_TABLE,
            title: t('layouts.routes.databases.tabs.table'),
            icon: getIconByTabName(TAB_NAME_INDEXES),
            component: async () => ClDatabaseDetailTabDatabasesSubTabIndexes,
          },
        ],
      },
      {
        path: TAB_NAME_CONSOLE,
        title: t('layouts.routes.databases.tabs.console'),
        icon: getIconByTabName(TAB_NAME_CONSOLE),
        component: async () => ClDatabaseDetailTabConsole,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
