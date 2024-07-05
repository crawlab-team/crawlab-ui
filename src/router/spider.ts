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
    component: async () => ClSpiderList,
  },
  {
    name: 'SpiderDetail',
    path: 'spiders/:id',
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClSpiderDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClSpiderDetailTabOverview,
      },
      {
        path: TAB_NAME_FILES,
        component: async () => ClSpiderDetailTabFiles,
      },
      {
        path: TAB_NAME_TASKS,
        component: async () => ClSpiderDetailTabTasks,
      },
      {
        path: TAB_NAME_SCHEDULES,
        component: async () => ClSpiderDetailTabSchedules,
      },
      {
        path: TAB_NAME_DATA,
        component: async () => ClSpiderDetailTabData,
      },
      {
        path: TAB_NAME_SETTINGS,
        component: async () => ClSpiderDetailTabSettings,
      },
      {
        path: TAB_NAME_DEPENDENCIES,
        component: async () => ClDependencySpiderTab,
      },
    ],
  },
] as Array<RouteRecordRaw>;
