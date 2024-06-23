import { RouteRecordRaw } from 'vue-router';
import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_FILES,
  TAB_NAME_CHANGES,
  TAB_NAME_LOGS,
  TAB_NAME_SPIDERS,
} from '@/constants/tab';

const endpoint = 'gits';

export default [
  {
    name: 'GitList',
    path: endpoint,
    component: () => import('@/views/git/list/GitList.vue'),
  },
  {
    name: 'GitDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/overview' };
    },
    component: () => import('@/views/git/detail/GitDetail.vue'),
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () =>
          import('@/views/git/detail/tabs/GitDetailTabOverview.vue'),
      },
      {
        path: TAB_NAME_FILES,
        component: () =>
          import('@/views/git/detail/tabs/GitDetailTabFiles.vue'),
      },
      {
        path: TAB_NAME_LOGS,
        component: () => import('@/views/git/detail/tabs/GitDetailTabLogs.vue'),
      },
      {
        path: TAB_NAME_CHANGES,
        component: () =>
          import('@/views/git/detail/tabs/GitDetailTabChanges.vue'),
      },
      {
        path: TAB_NAME_SPIDERS,
        component: () =>
          import('@/views/git/detail/tabs/GitDetailTabSpiders.vue'),
      },
    ],
  },
] as Array<RouteRecordRaw>;
