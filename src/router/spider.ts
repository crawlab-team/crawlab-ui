import { RouteRecordRaw } from 'vue-router';
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

export default [
  {
    name: 'SpiderList',
    path: 'spiders',
    component: () => ClSpiderList,
  },
  {
    name: 'SpiderDetail',
    path: 'spiders/:id',
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: () => ClSpiderDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () => ClSpiderDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        component: () => ClSpiderDetailTabFiles,
      },
      {
        path: TAB_NAME_TASKS,
        component: () => ClSpiderDetailTabTasks,
      },
      {
        path: TAB_NAME_SCHEDULES,
        component: () => ClSpiderDetailTabSchedules,
      },
      {
        path: TAB_NAME_DATA,
        component: () => ClSpiderDetailTabData,
      },
      {
        path: TAB_NAME_SETTINGS,
        component: () => ClSpiderDetailTabSettings,
      },
      {
        path: TAB_NAME_DEPENDENCIES,
        component: () => ClDependencySpiderTab,
      },
    ],
  },
] as Array<RouteRecordRaw>;
