import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState,
} from '@/utils/store';
import useRequest from '@/services/request';
import { ROLE_NORMAL } from '@/constants/user';
import { LOCAL_STORAGE_KEY_ME } from '@/constants/localStorage';

const { get, post, put } = useRequest();

const state = {
  ...getDefaultStoreState<User>('user'),
  newFormFn: () => {
    return {
      role: ROLE_NORMAL,
    };
  },
} as UserStoreState;

const getters = {
  ...getDefaultStoreGetters<User>(),
} as UserStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<User>(),
} as UserStoreMutations;

const actions = {
  ...getDefaultStoreActions<User>('/users'),
  changePassword: async (
    ctx: StoreActionContext,
    { id, password }: { id: string; password: string }
  ) => {
    return await post(`/users/${id}/change-password`, { password });
  },
} as UserStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as UserStoreModule;
