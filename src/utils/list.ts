import { onBeforeMount, Ref } from 'vue';
import { Store } from 'vuex';
import { setupAutoUpdate } from '@/utils/auto';
import { translate } from '@/utils/i18n';
import { cloneArray } from '@/utils/object';
import { FILTER_OP_EQUAL } from '@/constants';

const t = translate;

export const getDefaultUseListOptions = <T extends BaseModel>(
  navActions: Ref<ListActionGroup[]>,
  tableColumns: Ref<TableColumns<T>>
): UseListOptions<T> => {
  return {
    navActions,
    tableColumns,
  };
};

export const setupGetAllList = (
  store: Store<RootStoreState>,
  allListNamespaces: ListStoreNamespace[]
) => {
  onBeforeMount(async () => {
    await Promise.all(
      allListNamespaces?.map(ns => store.dispatch(`${ns}/getAllList`)) || []
    );
  });
};

export const setupListComponent = (
  ns: ListStoreNamespace,
  store: Store<RootStoreState>,
  allListNamespaces?: ListStoreNamespace[],
  autoUpdate: boolean = true
) => {
  if (!allListNamespaces) allListNamespaces = [];

  // get all list
  setupGetAllList(store, allListNamespaces);

  // auto update
  if (autoUpdate) {
    setupAutoUpdate(async () => {
      await store.dispatch(`${ns}/getList`);
    });
  }
};

export const prependAllToSelectOptions = (
  options: SelectOption[]
): SelectOption[] => {
  const _options = cloneArray(options);
  return cloneArray([
    { label: t('common.mode.all'), value: undefined },
    ..._options,
  ]);
};

export const onListFilterChangeByKey = (
  store: Store<RootStoreState>,
  ns: ListStoreNamespace,
  key: string,
  op?: string,
  options: {
    update: boolean;
  } = { update: true }
) => {
  if (!op) op = FILTER_OP_EQUAL;
  return async (value: string) => {
    store.commit(`${ns}/setTableListFilterByKey`, {
      key,
      conditions: value !== undefined ? [{ key, op, value }] : [],
    });
    if (options.update) {
      await store.dispatch(`${ns}/getList`);
    }
  };
};
