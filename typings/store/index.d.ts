import { Store } from 'vuex';
export declare const createStore: () => Store<RootStoreState>;
export declare const setStore: (store: Store<RootStoreState>) => void;
export declare const getStore: () => Store<RootStoreState>;
export declare const addStoreModule: <M>(path: string, module: M, store?: Store<RootStoreState>) => void;
