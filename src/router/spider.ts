import {
  TAB_NAME_DATA,
  TAB_NAME_DEPENDENCIES,
  TAB_NAME_FILES,
  TAB_NAME_OVERVIEW,
  TAB_NAME_SCHEDULES,
  TAB_NAME_TASKS,
} from '@/constants/tab';
import {
  ClSpiderDetail,
  ClSpiderDetailTabData,
  ClSpiderDetailTabDependencies,
  ClSpiderDetailTabFiles,
  ClSpiderDetailTabOverview,
  ClSpiderDetailTabSchedules,
  ClSpiderDetailTabTasks,
  ClSpiderList,
} from '@/views';
import { getIconByRouteConcept, getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/spiders';

export default [
  {
    routeConcept: 'spider',
    name: 'SpiderList',
    path: endpoint,
    title: t('layouts.routes.spiders.list.title'),
    icon: getIconByRouteConcept('spider'),
    component: async () => ClSpiderList,
  },
  {
    routeConcept: 'spider',
    name: 'SpiderDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.spiders.detail.title'),
    icon: getIconByRouteConcept('spider'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClSpiderDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.spiders.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClSpiderDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        title: t('layouts.routes.spiders.detail.tabs.files'),
        icon: getIconByTabName(TAB_NAME_FILES),
        component: async () => ClSpiderDetailTabFiles,
      },
      {
        path: TAB_NAME_TASKS,
        title: t('layouts.routes.spiders.detail.tabs.tasks'),
        icon: getIconByTabName(TAB_NAME_TASKS),
        component: async () => ClSpiderDetailTabTasks,
      },
      {
        path: TAB_NAME_SCHEDULES,
        title: t('layouts.routes.spiders.detail.tabs.schedules'),
        icon: getIconByTabName(TAB_NAME_SCHEDULES),
        component: async () => ClSpiderDetailTabSchedules,
      },
      {
        path: TAB_NAME_DATA,
        title: t('layouts.routes.spiders.detail.tabs.data'),
        icon: getIconByTabName(TAB_NAME_DATA),
        component: async () => ClSpiderDetailTabData,
      },
      {
        path: TAB_NAME_DEPENDENCIES,
        title: t('layouts.routes.spiders.detail.tabs.dependencies'),
        icon: getIconByTabName(TAB_NAME_DEPENDENCIES),
        component: async () => ClSpiderDetailTabDependencies,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
