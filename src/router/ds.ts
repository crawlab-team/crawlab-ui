import { TAB_NAME_OVERVIEW } from '@/constants';
import {
  ClDataSourceDetail,
  ClDataSourceDetailTabOverview,
  ClDataSourceList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';

const t = translate;

const endpoint = 'data-sources';

export default [
  {
    name: 'DataSourceList',
    path: endpoint,
    title: t('layouts.routes.dataSources.title'),
    icon: ['fa', 'database'],
    component: async () => ClDataSourceList,
  },
  {
    name: 'DataSourceDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClDataSourceDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.dataSources.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClDataSourceDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
