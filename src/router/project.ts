import { TAB_NAME_OVERVIEW, TAB_NAME_SPIDERS } from '@/constants/tab';
import {
  ClProjectDetail,
  ClProjectDetailTabOverview,
  ClProjectDetailTabSpiders,
  ClProjectList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'projects';

export default [
  {
    name: 'ProjectList',
    path: endpoint,
    title: t('layouts.routes.projects.title'),
    icon: ['fa', 'project-diagram'],
    component: async () => ClProjectList,
  },
  {
    name: 'ProjectDetail',
    path: `${endpoint}/:id`,
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClProjectDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.projects.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClProjectDetailTabOverview,
      },
      {
        path: TAB_NAME_SPIDERS,
        title: t('layouts.routes.projects.tabs.spiders'),
        icon: getIconByTabName(TAB_NAME_SPIDERS),
        component: async () => ClProjectDetailTabSpiders,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
