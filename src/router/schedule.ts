import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW, TAB_NAME_TASKS } from '@/constants/tab';
import {
  ClScheduleDetail,
  ClScheduleDetailTabOverview,
  ClScheduleDetailTabTasks,
  ClScheduleList,
} from '@/views';

export default [
  {
    name: 'ScheduleList',
    path: 'schedules',
    component: async () => ClScheduleList,
  },
  {
    name: 'ScheduleDetail',
    path: 'schedules/:id',
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClScheduleDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClScheduleDetailTabOverview,
      },
      {
        path: TAB_NAME_TASKS,
        component: async () => ClScheduleDetailTabTasks,
      },
    ],
  },
] as Array<RouteRecordRaw>;
