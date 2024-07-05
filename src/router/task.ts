import { RouteRecordRaw } from 'vue-router';
import {
  TAB_NAME_DATA,
  TAB_NAME_LOGS,
  TAB_NAME_OVERVIEW,
} from '@/constants/tab';
import {
  ClTaskDetail,
  ClTaskDetailTabData,
  ClTaskDetailTabLogs,
  ClTaskDetailTabOverview,
  ClTaskList,
} from '@/views';

const endpoint = 'tasks';

export default [
  {
    name: 'TaskList',
    path: endpoint,
    component: async () => ClTaskList,
  },
  {
    name: 'TaskDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClTaskDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClTaskDetailTabOverview,
      },
      {
        path: TAB_NAME_LOGS,
        component: async () => ClTaskDetailTabLogs,
      },
      {
        path: TAB_NAME_DATA,
        component: async () => ClTaskDetailTabData,
      },
    ],
  },
] as Array<RouteRecordRaw>;
