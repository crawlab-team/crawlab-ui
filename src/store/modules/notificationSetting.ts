import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import { TAB_NAME_OVERVIEW, TAB_NAME_TEMPLATE } from '@/constants';
import { translate } from '@/utils/i18n';

const t = translate;

const state = {
  ...getDefaultStoreState<NotificationSetting>('notificationSetting'),
  newFormFn: () => ({
    enabled: true,
  }),
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
    { id: TAB_NAME_TEMPLATE, title: t('common.tabs.template') },
  ],
} as NotificationSettingStoreState;

const getters = {
  ...getDefaultStoreGetters<NotificationSetting>(),
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
