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
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'gits';

export default [
  {
    name: 'GitList',
    path: endpoint,
    title: t('layouts.routes.gits.title'),
    icon: ['fab', 'git'],
    component: async () => ClGitList,
  },
  {
    name: 'GitDetail',
    path: `${endpoint}/:id`,
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClGitDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.gits.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClGitDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        title: t('layouts.routes.gits.tabs.files'),
        icon: getIconByTabName(TAB_NAME_FILES),
        component: async () => ClGitDetailTabFiles,
      },
      {
        path: TAB_NAME_LOGS,
        title: t('layouts.routes.gits.tabs.logs'),
        icon: getIconByTabName(TAB_NAME_LOGS),
        component: async () => ClGitDetailTabLogs,
      },
      {
        path: TAB_NAME_CHANGES,
        title: t('layouts.routes.gits.tabs.changes'),
        icon: getIconByTabName(TAB_NAME_CHANGES),
        component: async () => ClGitDetailTabChanges,
      },
      {
        path: TAB_NAME_SPIDERS,
        title: t('layouts.routes.gits.tabs.spiders'),
        icon: getIconByTabName(TAB_NAME_SPIDERS),
        component: async () => ClGitDetailTabSpiders,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
