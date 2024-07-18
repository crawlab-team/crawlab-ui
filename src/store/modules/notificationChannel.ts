import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import { TAB_NAME_OVERVIEW } from '@/constants';
import { translate } from '@/utils/i18n';

const t = translate;

const state = {
  ...getDefaultStoreState<NotificationChannel>('notificationChannel'),
  tabs: [{ id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') }],
} as NotificationChannelStoreState;

const getters = {
  ...getDefaultStoreGetters<NotificationChannel>(),
} as NotificationChannelStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<NotificationChannel>(),
} as NotificationChannelStoreMutations;

const actions = {
  ...getDefaultStoreActions<NotificationChannel>('/notifications/channels'),
} as NotificationChannelStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NotificationChannelStoreModule;
