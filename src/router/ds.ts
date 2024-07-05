import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW } from '@/constants';
import {
  ClDataSourceDetail,
  ClDataSourceDetailTabOverview,
  ClDataSourceList,
} from '@/views';

const endpoint = 'data-sources';

export default [
  {
    name: 'DataSourceList',
    path: endpoint,
    component: () => ClDataSourceList,
  },
  {
    name: 'DataSourceDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: () => ClDataSourceDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () => ClDataSourceDetailTabOverview,
      },
    ],
  },
] as Array<RouteRecordRaw>;
