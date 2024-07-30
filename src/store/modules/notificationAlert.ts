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
  ...getDefaultStoreState<NotificationAlert>('notificationAlert'),
  newFormFn: () => ({
    name: '',
    enabled: true,
    has_metric_target: false,
    operator: 'ge',
    lasting_seconds: 60 * 5,
    level: 'warning',
  }),
  tabs: [{ id: TAB_NAME_OVERVIEW, title: t('common.tabs.overview') }],
} as NotificationAlertStoreState;

const getters = {
  ...getDefaultStoreGetters<NotificationAlert>(),
} as NotificationAlertStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<NotificationAlert>(),
} as NotificationAlertStoreMutations;

const actions = {
  ...getDefaultStoreActions<NotificationAlert>('/notifications/alerts'),
} as NotificationAlertStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NotificationAlertStoreModule;
