import { LOCAL_STORAGE_KEY_TOKEN } from '@/constants/localStorage';
import { getStore } from '@/store';

const store = getStore();
const rootState = store.state as RootStoreState;
const commonState = rootState.common;

export const getToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN);
};

export const setToken = (token: string) => {
  return localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
};

export const isAllowedAction = (target: string, action: string): boolean => {
  const store = getStore();
  const actionVisibleFn = (store.state as RootStoreState).layout
    .actionVisibleFn;
  if (!actionVisibleFn) return true;
  return actionVisibleFn(target, action);
};

export const isPro = (): boolean => {
  const store = getStore();
  return !!store.getters['common/isPro'];
};

export const isAllowedRoutePath = (path: string): boolean => {
  if (!isPro()) return true;
  if (!commonState.me) return false;
  if (commonState.me.root_admin) return true;
  return commonState.me.routes?.includes(path) || false;
};
