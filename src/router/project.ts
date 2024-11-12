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

const endpoint = '/projects';

export default [
  {
    routeConcept: 'project',
    name: 'ProjectList',
    path: endpoint,
    title: t('layouts.routes.projects.list.title'),
    component: async () => ClProjectList,
  },
  {
    routeConcept: 'project',
    name: 'ProjectDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.projects.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClProjectDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.projects.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClProjectDetailTabOverview,
      },
      {
        path: TAB_NAME_SPIDERS,
        title: t('layouts.routes.projects.detail.tabs.spiders'),
        icon: getIconByTabName(TAB_NAME_SPIDERS),
        component: async () => ClProjectDetailTabSpiders,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
