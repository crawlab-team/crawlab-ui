import { RouteRecordRaw } from 'vue-router';
import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_TRIGGERS,
  TAB_NAME_TEMPLATE,
} from '@/constants';
import {
  ClNotificationDetail,
  ClNotificationDetailTabOverview,
  ClNotificationDetailTabTemplate,
  ClNotificationDetailTabTriggers,
  ClNotificationList,
} from '@/views';

const endpoint = 'notifications';

export default [
  {
    name: 'NotificationList',
    path: `${endpoint}`,
    component: () => ClNotificationList,
  },
  {
    name: 'NotificationDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: () => ClNotificationDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () => ClNotificationDetailTabOverview,
      },
      {
        path: TAB_NAME_TRIGGERS,
        component: () => ClNotificationDetailTabTriggers,
      },
      {
        path: TAB_NAME_TEMPLATE,
        component: () => ClNotificationDetailTabTemplate,
      },
    ],
  },
] as Array<RouteRecordRaw>;
