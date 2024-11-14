import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import { TAB_NAME_OVERVIEW } from '@/constants';
import { translate } from '@/utils/i18n';
import useRequest from '@/services/request';
import { getI18n } from '@/i18n';

const { post } = useRequest();

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
  sendTestMessage: async (
    _: StoreActionContext,
    { id, toMail }: { id: string; toMail?: string }
  ) => {
    const locale = getI18n().global.locale.value;
    return await post(`/notifications/channels/${id}/test`, {
      locale,
      to_mail: toMail ? toMail.split(',').map(item => item.trim()) : undefined,
    });
  },
} as NotificationChannelStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as NotificationChannelStoreModule;
