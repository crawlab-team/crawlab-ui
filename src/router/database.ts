import { TAB_NAME_OVERVIEW } from '@/constants';
import {
  ClDatabaseDetail,
  ClDatabaseDetailTabOverview,
  ClDatabaseList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'data-sources';

export default [
  {
    name: 'DatabaseList',
    path: endpoint,
    title: t('layouts.routes.dataSources.title'),
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
        title: t('layouts.routes.dataSources.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClDatabaseDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
