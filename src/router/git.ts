import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_FILES,
  TAB_NAME_CHANGES,
  TAB_NAME_SPIDERS,
  TAB_NAME_COMMITS,
} from '@/constants/tab';
import {
  ClGitDetail,
  ClGitDetailTabChanges,
  ClGitDetailTabCommits,
  ClGitDetailTabFiles,
  ClGitDetailTabOverview,
  ClGitDetailTabSpiders,
  ClGitList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/gits';

export default [
  {
    routeConcept: 'git',
    name: 'GitList',
    path: endpoint,
    title: t('layouts.routes.gits.list.title'),
    component: async () => ClGitList,
  },
  {
    routeConcept: 'git',
    name: 'GitDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.gits.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/overview' };
    },
    component: async () => ClGitDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.gits.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClGitDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        title: t('layouts.routes.gits.detail.tabs.files'),
        icon: getIconByTabName(TAB_NAME_FILES),
        component: async () => ClGitDetailTabFiles,
      },
      {
        path: TAB_NAME_COMMITS,
        title: t('layouts.routes.gits.detail.tabs.commits'),
        icon: getIconByTabName(TAB_NAME_COMMITS),
        component: async () => ClGitDetailTabCommits,
      },
      {
        path: TAB_NAME_CHANGES,
        title: t('layouts.routes.gits.detail.tabs.changes'),
        icon: getIconByTabName(TAB_NAME_CHANGES),
        component: async () => ClGitDetailTabChanges,
      },
      {
        path: TAB_NAME_SPIDERS,
        title: t('layouts.routes.gits.detail.tabs.spiders'),
        icon: getIconByTabName(TAB_NAME_SPIDERS),
        component: async () => ClGitDetailTabSpiders,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
