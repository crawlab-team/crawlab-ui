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
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/nodes';

export default [
  {
    routeConcept: 'node',
    name: 'NodeList',
    path: endpoint,
    title: t('layouts.routes.nodes.list.title'),
    component: async () => ClNodeList,
  },
  {
    routeConcept: 'node',
    name: 'NodeDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.nodes.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNodeDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.nodes.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNodeDetailTabOverview,
      },
      {
        path: TAB_NAME_TASKS,
        title: t('layouts.routes.nodes.detail.tabs.tasks'),
        icon: getIconByTabName(TAB_NAME_TASKS),
        component: async () => ClNodeDetailTabTasks,
      },
      {
        path: TAB_NAME_MONITORING,
        title: t('layouts.routes.nodes.detail.tabs.monitoring'),
        icon: getIconByTabName(TAB_NAME_MONITORING),
        component: async () => ClNodeDetailTabMonitoring,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
