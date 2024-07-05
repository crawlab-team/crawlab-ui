import { RouteRecordRaw } from 'vue-router';
import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_FILES,
  TAB_NAME_CHANGES,
  TAB_NAME_LOGS,
  TAB_NAME_SPIDERS,
} from '@/constants/tab';
import {
  ClGitDetail,
  ClGitDetailTabChanges,
  ClGitDetailTabFiles,
  ClGitDetailTabLogs,
  ClGitDetailTabOverview,
  ClGitDetailTabSpiders,
  ClGitList,
} from '@/views';

const endpoint = 'gits';

export default [
  {
    name: 'GitList',
    path: endpoint,
    component: async () => ClGitList,
  },
  {
    name: 'GitDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClGitDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClGitDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        component: async () => ClGitDetailTabFiles,
      },
      {
        path: TAB_NAME_LOGS,
        component: async () => ClGitDetailTabLogs,
      },
      {
        path: TAB_NAME_CHANGES,
        component: async () => ClGitDetailTabChanges,
      },
      {
        path: TAB_NAME_SPIDERS,
        component: async () => ClGitDetailTabSpiders,
      },
    ],
  },
] as Array<RouteRecordRaw>;
