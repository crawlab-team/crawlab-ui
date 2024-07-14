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
  ...getDefaultStoreState<NotificationSetting>('notification'),
  newFormFn: () => {
    return {
      name: '',
      description: '',
      type: 'mail',
      enabled: true,
      global: true,
      triggers: [],
      title: '',
      template: '',
      mail: {
        server: '',
        port: '465',
        user: '',
        password: '',
        sender_email: '',
        sender_identity: '',
        to: '',
        cc: '',
      },
      mobile: {
        webhook: '',
      },
    };
  },
  tabs: [
    { id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') },
    { id: TAB_NAME_TEMPLATE, title: t('common.tabs.template') },
  ],
  triggersList: [],
} as NotificationStoreState;

const getters = {
  ...getDefaultStoreGetters<NotificationSetting>(),
} as NotificationStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<NotificationSetting>(),
  setTriggersList: (state: NotificationStoreState, triggersList: string[]) => {
    state.triggersList = triggersList;
  },
  resetTriggersList: (state: NotificationStoreState) => {
    state.triggersList = [];
  },
  setTriggersEnabled: (state: NotificationStoreState, triggers: string[]) => {
    state.form.triggers = triggers;
  },
  resetTriggersEnabled: (state: NotificationStoreState) => {
    state.form.triggers = [];
  },
  setTemplateTitle: (state: NotificationStoreState, title: string) => {
    state.form.title = title;
  },
  resetTemplateTitle: (state: NotificationStoreState) => {
    state.form.title = '';
  },
  setTemplateContent: (state: NotificationStoreState, template: string) => {
    state.form.template_markdown = template;
  },
  resetTemplateContent: (state: NotificationStoreState) => {
    state.form.template_markdown = '';
  },
} as NotificationStoreMutations;

const actions = {
  ...getDefaultStoreActions<NotificationSetting>('/notifications/settings'),
} as NotificationStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NotificationStoreModule;
