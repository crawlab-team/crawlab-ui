import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW, TAB_NAME_TEMPLATE } from '@/constants';
import {
  ClNotificationSettingDetail,
  ClNotificationSettingDetailTabOverview,
  ClNotificationSettingDetailTabTemplate,
  ClNotificationSettingList,
} from '@/views';

const endpoint = 'notifications';

export default [
  {
    name: 'NotificationSettingList',
    path: `${endpoint}/settings`,
    component: async () => ClNotificationSettingList,
  },
  {
    name: 'NotificationSettingDetail',
    path: `${endpoint}/settings/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNotificationSettingDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClNotificationSettingDetailTabOverview,
      },
      {
        path: TAB_NAME_TEMPLATE,
        component: async () => ClNotificationSettingDetailTabTemplate,
      },
    ],
  },
] as Array<RouteRecordRaw>;
