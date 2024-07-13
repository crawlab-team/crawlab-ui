import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW, TAB_NAME_TEMPLATE } from '@/constants';
import {
  ClNotificationDetail,
  ClNotificationDetailTabOverview,
  ClNotificationDetailTabTemplate,
  ClNotificationList,
} from '@/views';

const endpoint = 'notifications';

export default [
  {
    name: 'NotificationList',
    path: `${endpoint}`,
    component: async () => ClNotificationList,
  },
  {
    name: 'NotificationDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNotificationDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClNotificationDetailTabOverview,
      },
      {
        path: TAB_NAME_TEMPLATE,
        component: async () => ClNotificationDetailTabTemplate,
      },
    ],
  },
] as Array<RouteRecordRaw>;
