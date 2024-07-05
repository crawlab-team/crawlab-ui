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
    component: () => ClGitList,
  },
  {
    name: 'GitDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/overview' };
    },
    component: () => ClGitDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () => ClGitDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        component: () => ClGitDetailTabFiles,
      },
      {
        path: TAB_NAME_LOGS,
        component: () => ClGitDetailTabLogs,
      },
      {
        path: TAB_NAME_CHANGES,
        component: () => ClGitDetailTabChanges,
      },
      {
        path: TAB_NAME_SPIDERS,
        component: () => ClGitDetailTabSpiders,
      },
    ],
  },
] as Array<RouteRecordRaw>;
