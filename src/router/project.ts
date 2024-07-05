import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW, TAB_NAME_SPIDERS } from '@/constants/tab';
import {
  ClProjectDetail,
  ClProjectDetailTabOverview,
  ClProjectDetailTabSpiders,
  ClProjectList,
} from '@/views';

const endpoint = 'projects';

export default [
  {
    name: 'ProjectList',
    path: endpoint,
    component: () => ClProjectList,
  },
  {
    name: 'ProjectDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/overview' };
    },
    component: () => ClProjectDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () => ClProjectDetailTabOverview,
      },
      {
        path: TAB_NAME_SPIDERS,
        component: () => ClProjectDetailTabSpiders,
      },
    ],
  },
] as Array<RouteRecordRaw>;
