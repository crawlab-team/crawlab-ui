import {
  TAB_NAME_CHANNELS,
  TAB_NAME_MAIL,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TEMPLATE,
} from '@/constants';
import {
  ClNotificationChannelDetail,
  ClNotificationChannelDetailTabOverview,
  ClNotificationChannelList,
  ClNotificationSettingDetail,
  ClNotificationSettingDetailTabChannels,
  ClNotificationSettingDetailTabOverview,
  ClNotificationSettingDetailTabTemplate,
  ClNotificationSettingList,
  ClNotificationSettingDetailTabMailConfig,
  ClNotificationRequestList,
  ClNotificationAlertList,
  ClNotificationAlertDetail,
  ClNotificationAlertDetailTabOverview,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'notifications';

export default [
  {
    path: endpoint,
    title: t('layouts.routes.notifications.title'),
    icon: ['fa', 'envelope'],
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/settings' };
    },
  },
  {
    name: 'NotificationSettingList',
    path: `${endpoint}/settings`,
    title: t('layouts.routes.notifications.settings.list.title'),
    icon: ['fa', 'cog'],
    component: async () => ClNotificationSettingList,
  },
  {
    name: 'NotificationSettingDetail',
    path: `${endpoint}/settings/:id`,
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNotificationSettingDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.notifications.settings.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNotificationSettingDetailTabOverview,
      },
      {
        path: TAB_NAME_MAIL,
        title: t('layouts.routes.notifications.settings.detail.tabs.mail'),
        icon: getIconByTabName(TAB_NAME_MAIL),
        component: async () => ClNotificationSettingDetailTabMailConfig,
      },
      {
        path: TAB_NAME_TEMPLATE,
        title: t('layouts.routes.notifications.settings.detail.tabs.template'),
        icon: getIconByTabName(TAB_NAME_TEMPLATE),
        component: async () => ClNotificationSettingDetailTabTemplate,
      },
      {
        path: TAB_NAME_CHANNELS,
        title: t('layouts.routes.notifications.settings.detail.tabs.channels'),
        icon: getIconByTabName(TAB_NAME_CHANNELS),
        component: async () => ClNotificationSettingDetailTabChannels,
      },
    ],
  },
  {
    name: 'NotificationChannelList',
    path: `${endpoint}/channels`,
    title: t('layouts.routes.notifications.channels.list.title'),
    icon: ['fa', 'broadcast-tower'],
    component: async () => ClNotificationChannelList,
  },
  {
    name: 'NotificationChannelDetail',
    path: `${endpoint}/channels/:id`,
    title: t('layouts.routes.notifications.channels.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNotificationChannelDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.notifications.channels.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNotificationChannelDetailTabOverview,
      },
    ],
  },
  {
    name: 'NotificationRequestList',
    path: `${endpoint}/requests`,
    title: t('layouts.routes.notifications.requests.list.title'),
    icon: ['fa', 'paper-plane'],
    component: async () => ClNotificationRequestList,
  },
  {
    name: 'NotificationAlertList',
    path: `${endpoint}/alerts`,
    title: t('layouts.routes.notifications.alerts.list.title'),
    icon: ['fa', 'bell'],
    component: async () => ClNotificationAlertList,
  },
  {
    name: 'NotificationAlertDetail',
    path: `${endpoint}/alerts/:id`,
    title: t('layouts.routes.notifications.alerts.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNotificationAlertDetail,
    children: [
      {
        name: 'NotificationAlertDetailOverview',
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.notifications.alerts.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNotificationAlertDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
