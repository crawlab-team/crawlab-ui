import { TAB_NAME_OVERVIEW, TAB_NAME_TEMPLATE } from '@/constants';
import {
  ClNotificationSettingDetail,
  ClNotificationSettingDetailTabOverview,
  ClNotificationSettingDetailTabTemplate,
  ClNotificationSettingList,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';

const t = translate;

const endpoint = 'notifications';

export default [
  {
    name: 'NotificationSettingList',
    path: `${endpoint}/settings`,
    title: t('layouts.routes.notifications.settings.title'),
    icon: ['fa', 'envelope'],
    component: async () => ClNotificationSettingList,
  },
  {
    name: 'NotificationSettingDetail',
    path: `${endpoint}/settings/:id`,
    title: t('layouts.routes.notifications.settings.title'),
    icon: ['fa', 'envelope'],
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
    ],
  },
] as Array<ExtendedRouterRecord>;
