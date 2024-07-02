import { RouteRecordRaw } from 'vue-router';
import {
  TAB_NAME_MONITORING,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TASKS,
} from '@/constants/tab';

const endpoint = 'nodes';

export default [
  {
    name: 'NodeList',
    path: endpoint,
    component: () => import('@/views/node/list/NodeList.vue'),
  },
  {
    name: 'NodeDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: () => import('@/views/node/detail/NodeDetail.vue'),
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () =>
          import('@/views/node/detail/tabs/NodeDetailTabOverview.vue'),
      },
      {
        path: TAB_NAME_TASKS,
        component: () =>
          import('@/views/node/detail/tabs/NodeDetailTabTasks.vue'),
      },
      {
        path: TAB_NAME_MONITORING,
        component: () =>
          import('@/views/node/detail/tabs/NodeDetailTabMonitoring.vue'),
      },
    ],
  },
] as Array<RouteRecordRaw>;
