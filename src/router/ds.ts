import { RouteRecordRaw } from 'vue-router';
import DataSourceList from '@/views/ds/list/DataSourceList.vue';
import DataSourceDetail from '@/views/ds/detail/DataSourceDetail.vue';
import DataSourceDetailTabOverview from '@/views/ds/detail/tabs/DataSourceDetailTabOverview.vue';
import { TAB_NAME_OVERVIEW } from '@/constants';

const endpoint = 'data-sources';

export default [
  {
    name: 'DataSourceList',
    path: endpoint,
    component: DataSourceList,
  },
  {
    name: 'DataSourceDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: DataSourceDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: DataSourceDetailTabOverview,
      },
    ],
  },
] as Array<RouteRecordRaw>;
