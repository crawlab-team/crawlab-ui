import { RouteRecordRaw } from 'vue-router';
import {
  TAB_NAME_MONITORING,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import {
  ClNodeDetail,
  ClNodeDetailTabMonitoring,
  ClNodeDetailTabOverview,
  ClNodeDetailTabTasks,
  ClNodeList,
} from '@/views';

const endpoint = 'nodes';

export default [
  {
    name: 'NodeList',
    path: endpoint,
    component: async () => ClNodeList,
  },
  {
    name: 'NodeDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNodeDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClNodeDetailTabOverview,
      },
      {
        path: TAB_NAME_TASKS,
        component: async () => ClNodeDetailTabTasks,
      },
      {
        path: TAB_NAME_MONITORING,
        component: async () => ClNodeDetailTabMonitoring,
      },
    ],
  },
] as Array<RouteRecordRaw>;
