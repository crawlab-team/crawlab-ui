import {
  TAB_NAME_CHANNELS,
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
} from '@/views';
import { getIconByTabName, translate } from '@/utils';

const t = translate;

const endpoint = 'notifications';

export default [
  {
    path: endpoint,
    title: t('layouts.routes.notifications.title'),
    icon: ['fa', 'envelope'],
    redirect: to => {
      return { path: to.path + '/settings' };
    },
  },
  {
    name: 'NotificationSettingList',
    path: `${endpoint}/settings`,
    title: t('layouts.routes.notifications.settings.title'),
    icon: ['fa', 'cog'],
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
        title: t('layouts.routes.notifications.settings.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNotificationSettingDetailTabOverview,
      },
      {
        path: TAB_NAME_TEMPLATE,
        title: t('layouts.routes.notifications.settings.tabs.template'),
        icon: getIconByTabName(TAB_NAME_TEMPLATE),
        component: async () => ClNotificationSettingDetailTabTemplate,
      },
      {
        path: TAB_NAME_CHANNELS,
        title: t('layouts.routes.notifications.settings.tabs.channels'),
        icon: getIconByTabName(TAB_NAME_CHANNELS),
        component: async () => ClNotificationSettingDetailTabChannels,
      },
    ],
  },
  {
    name: 'NotificationChannelList',
    path: `${endpoint}/channels`,
    title: t('layouts.routes.notifications.channels.title'),
    icon: ['fa', 'broadcast-tower'],
    component: async () => ClNotificationChannelList,
  },
  {
    name: 'NotificationChannelDetail',
    path: `${endpoint}/channels/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClNotificationChannelDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.notifications.channels.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClNotificationChannelDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
