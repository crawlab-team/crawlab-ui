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
  ...getDefaultStoreState<NotificationRequest>('notificationRequest'),
  tabs: [{ id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') }],
} as NotificationRequestStoreState;

const getters = {
  ...getDefaultStoreGetters<NotificationRequest>(),
} as NotificationRequestStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<NotificationRequest>(),
} as NotificationRequestStoreMutations;

const actions = {
  ...getDefaultStoreActions<NotificationRequest>('/notifications/requests'),
} as NotificationRequestStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NotificationRequestStoreModule;
