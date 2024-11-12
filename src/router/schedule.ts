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

const endpoint = '/schedules';

export default [
  {
    routeConcept: 'schedule',
    name: 'ScheduleList',
    path: endpoint,
    title: t('layouts.routes.schedules.list.title'),
    icon: ['fa', 'clock'],
    component: async () => ClScheduleList,
  },
  {
    routeConcept: 'schedule',
    name: 'ScheduleDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.schedules.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClScheduleDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.schedules.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClScheduleDetailTabOverview,
      },
      {
        path: TAB_NAME_TASKS,
        title: t('layouts.routes.schedules.detail.tabs.tasks'),
        icon: getIconByTabName(TAB_NAME_TASKS),
        component: async () => ClScheduleDetailTabTasks,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
