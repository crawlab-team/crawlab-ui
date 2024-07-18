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
import { getIconByTabName, translate } from '@/utils';

const t = translate;

const endpoint = 'nodes';

export default [
  {
    name: 'NodeList',
    path: endpoint,
    title: t('layouts.routes.nodes.title'),
    icon: ['fa', 'server'],
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
        title: t('layouts.routes.nodes.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNodeDetailTabOverview,
      },
      {
        path: TAB_NAME_TASKS,
        title: t('layouts.routes.nodes.tabs.tasks'),
        icon: getIconByTabName(TAB_NAME_TASKS),
        component: async () => ClNodeDetailTabTasks,
      },
      {
        path: TAB_NAME_MONITORING,
        title: t('layouts.routes.nodes.tabs.monitoring'),
        icon: getIconByTabName(TAB_NAME_MONITORING),
        component: async () => ClNodeDetailTabMonitoring,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
