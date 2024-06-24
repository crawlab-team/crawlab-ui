import { createStore as createVuexStore, Store } from 'vuex';
import common from '@/store/modules/common';
import layout from '@/store/modules/layout';
import node from '@/store/modules/node';
import project from '@/store/modules/project';
import spider from '@/store/modules/spider';
import task from '@/store/modules/task';
import file from '@/store/modules/file';
import tag from '@/store/modules/tag';
import dataCollection from '@/store/modules/dataCollection';
import schedule from '@/store/modules/schedule';
import user from '@/store/modules/user';
import token from '@/store/modules/token';
import plugin from '@/store/modules/plugin';
import git from '@/store/modules/git';
import notification from '@/store/modules/notification';
import ds from '@/store/modules/ds';
import environment from '@/store/modules/environment';
import system from '@/store/modules/system';

let _store: Store<RootStoreState>;

export const createStore = (): Store<RootStoreState> => {
  return createVuexStore<RootStoreState>({
    modules: {
      common,
      layout,
      node,
      project,
      spider,
      task,
      file,
      tag,
      dataCollection,
      schedule,
      user,
      token,
      plugin,
      git,
      notification,
      ds,
      environment,
      system,
    },
  });
};

export const setStore = (store: Store<RootStoreState>) => {
  _store = store;
};

export const getStore = (): Store<RootStoreState> => {
  if (!_store) {
    _store = createStore();
  }
  return _store;
};

export const addStoreModule = <M>(
  path: string,
  module: M,
  store?: Store<RootStoreState>
) => {
  if (!store) {
    store = getStore();
  }
  store.registerModule(path, module as any);
};
