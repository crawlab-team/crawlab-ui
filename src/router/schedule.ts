import { TAB_NAME_OVERVIEW, TAB_NAME_TASKS } from '@/constants/tab';
import {
  ClScheduleDetail,
  ClScheduleDetailTabOverview,
  ClScheduleDetailTabTasks,
  ClScheduleList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'schedules';

export default [
  {
    name: 'ScheduleList',
    path: endpoint,
    title: t('layouts.routes.schedules.title'),
    icon: ['fa', 'clock'],
    component: async () => ClScheduleList,
  },
  {
    name: 'ScheduleDetail',
    path: `${endpoint}/:id`,
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClScheduleDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.schedules.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClScheduleDetailTabOverview,
      },
      {
        path: TAB_NAME_TASKS,
        title: t('layouts.routes.schedules.tabs.tasks'),
        icon: getIconByTabName(TAB_NAME_TASKS),
        component: async () => ClScheduleDetailTabTasks,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
