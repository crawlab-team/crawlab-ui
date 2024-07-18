import {
  TAB_NAME_DATA,
  TAB_NAME_DEPENDENCIES,
  TAB_NAME_FILES,
  TAB_NAME_OVERVIEW,
  TAB_NAME_SCHEDULES,
  TAB_NAME_SETTINGS,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import {
  ClDependencySpiderTab,
  ClSpiderDetail,
  ClSpiderDetailTabData,
  ClSpiderDetailTabFiles,
  ClSpiderDetailTabOverview,
  ClSpiderDetailTabSchedules,
  ClSpiderDetailTabSettings,
  ClSpiderDetailTabTasks,
  ClSpiderList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';

const t = translate;

const endpoint = 'spiders';

export default [
  {
    name: 'SpiderList',
    path: endpoint,
    title: t('layouts.routes.spiders.title'),
    icon: ['fa', 'spider'],
    component: async () => ClSpiderList,
  },
  {
    name: 'SpiderDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClSpiderDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.spiders.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClSpiderDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        title: t('layouts.routes.spiders.tabs.files'),
        icon: getIconByTabName(TAB_NAME_FILES),
        component: async () => ClSpiderDetailTabFiles,
      },
      {
        path: TAB_NAME_TASKS,
        title: t('layouts.routes.spiders.tabs.tasks'),
        icon: getIconByTabName(TAB_NAME_TASKS),
        component: async () => ClSpiderDetailTabTasks,
      },
      {
        path: TAB_NAME_SCHEDULES,
        title: t('layouts.routes.spiders.tabs.schedules'),
        icon: getIconByTabName(TAB_NAME_SCHEDULES),
        component: async () => ClSpiderDetailTabSchedules,
      },
      {
        path: TAB_NAME_DATA,
        title: t('layouts.routes.spiders.tabs.data'),
        icon: getIconByTabName(TAB_NAME_DATA),
        component: async () => ClSpiderDetailTabData,
      },
      {
        path: TAB_NAME_SETTINGS,
        title: t('layouts.routes.spiders.tabs.settings'),
        icon: getIconByTabName(TAB_NAME_SETTINGS),
        component: async () => ClSpiderDetailTabSettings,
      },
      {
        path: TAB_NAME_DEPENDENCIES,
        title: t('layouts.routes.spiders.tabs.dependencies'),
        icon: getIconByTabName(TAB_NAME_DEPENDENCIES),
        component: async () => ClDependencySpiderTab,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
