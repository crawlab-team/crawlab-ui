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

const t = translate;

const endpoint = 'tasks';

export default [
  {
    name: 'TaskList',
    path: endpoint,
    title: t('layouts.routes.tasks.title'),
    icon: ['fa', 'tasks'],
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
        title: t('layouts.routes.tasks.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClTaskDetailTabOverview,
      },
      {
        path: TAB_NAME_LOGS,
        title: t('layouts.routes.tasks.tabs.logs'),
        icon: getIconByTabName(TAB_NAME_LOGS),
        component: async () => ClTaskDetailTabLogs,
      },
      {
        path: TAB_NAME_DATA,
        title: t('layouts.routes.tasks.tabs.data'),
        icon: getIconByTabName(TAB_NAME_DATA),
        component: async () => ClTaskDetailTabData,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
