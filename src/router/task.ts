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
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/tasks';

export default [
  {
    routeConcept: 'task',
    name: 'TaskList',
    path: endpoint,
    title: t('layouts.routes.tasks.list.title'),
    component: async () => ClTaskList,
  },
  {
    routeConcept: 'task',
    name: 'TaskDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.tasks.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClTaskDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.tasks.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClTaskDetailTabOverview,
      },
      {
        path: TAB_NAME_LOGS,
        title: t('layouts.routes.tasks.detail.tabs.logs'),
        icon: getIconByTabName(TAB_NAME_LOGS),
        component: async () => ClTaskDetailTabLogs,
      },
      {
        path: TAB_NAME_DATA,
        title: t('layouts.routes.tasks.detail.tabs.data'),
        icon: getIconByTabName(TAB_NAME_DATA),
        component: async () => ClTaskDetailTabData,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
