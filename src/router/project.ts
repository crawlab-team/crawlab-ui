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
    component: async () => ClProjectList,
  },
  {
    name: 'ProjectDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClProjectDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClProjectDetailTabOverview,
      },
      {
        path: TAB_NAME_SPIDERS,
        component: async () => ClProjectDetailTabSpiders,
      },
    ],
  },
] as Array<RouteRecordRaw>;
