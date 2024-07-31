import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import {
  TAB_NAME_CHANNELS,
  TAB_NAME_MAIL,
  TAB_NAME_OVERVIEW,
  TAB_NAME_TEMPLATE,
} from '@/constants';
import { translate } from '@/utils/i18n';
import {
  hasNotificationSettingChannelWarningMissingMailConfigFields,
  hasNotificationSettingMailChannel,
} from '@/utils';

const t = translate;

const state = {
  ...getDefaultStoreState<NotificationSetting>('notificationSetting'),
  newFormFn: () => ({
    enabled: true,
    template_mode: 'markdown',
  }),
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
    { id: TAB_NAME_MAIL, title: t('common.tabs.mail') },
    { id: TAB_NAME_TEMPLATE, title: t('common.tabs.template') },
    { id: TAB_NAME_CHANNELS, title: t('common.tabs.channels') },
  ],
} as NotificationSettingStoreState;

const getters = {
  ...getDefaultStoreGetters<NotificationSetting>(),
  tabs: (state: BaseStoreState, _, __, rootGetters) => {
    const { tabs, form } = state;
    return tabs.map(tab => {
      if (tab.id === TAB_NAME_MAIL) {
        let hasWarning = false;
        if (
          hasNotificationSettingMailChannel(
            form,
            rootGetters['notificationChannel/allDict']
          )
        ) {
          if (form.use_custom_sender_email && !form.sender_email) {
            hasWarning = true;
          } else if (!form.mail_to?.length) {
            hasWarning = true;
          }
        }
        return {
          ...tab,
          badgeType: 'warning',
          badge: hasWarning ? '!' : undefined,
        };
      } else if (tab.id === TAB_NAME_TEMPLATE) {
        let hasWarning = false;
        if (!form.title || !form.template_markdown) {
          hasWarning = true;
        }
        return {
          ...tab,
          badgeType: 'danger',
          badge: hasWarning ? '!' : undefined,
        };
      } else if (tab.id === TAB_NAME_CHANNELS) {
        const hasWarning =
          hasNotificationSettingChannelWarningMissingMailConfigFields(
            form,
            rootGetters['notificationChannel/allDict']
          ) || !form.channel_ids?.length;
        return {
          ...tab,
          badgeType: 'warning',
          badge: hasWarning ? '!' : undefined,
        };
      }
      return tab;
    });
  },
} as NotificationSettingStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<NotificationSetting>(),
  setTemplateTitle: (state: NotificationSettingStoreState, title: string) => {
    state.form.title = title;
  },
  resetTemplateTitle: (state: NotificationSettingStoreState) => {
    state.form.title = '';
  },
  setTemplateContent: (
    state: NotificationSettingStoreState,
    template: string
  ) => {
    state.form.template_markdown = template;
  },
  resetTemplateContent: (state: NotificationSettingStoreState) => {
    state.form.template_markdown = '';
  },
} as NotificationSettingStoreMutations;

const actions = {
  ...getDefaultStoreActions<NotificationSetting>('/notifications/settings'),
} as NotificationSettingStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NotificationSettingStoreModule;
