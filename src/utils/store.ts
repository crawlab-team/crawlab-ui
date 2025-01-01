import { getDefaultPagination } from '@/utils/pagination';
import { useService } from '@/services';
import { plainClone } from '@/utils/object';
import { emptyObjectFunc } from '@/utils/func';
import { translate } from '@/utils/i18n';
import {
  loadNamespaceLocalStorage,
  saveNamespaceLocalStorage,
} from '@/utils/storage';
import { getMd5 } from '@/utils/hash';

// i18n
const t = translate;

export const globalLayoutSettingsKey = 'globalLayoutSettings';

export const getDefaultStoreState = <T = any>(
  ns: StoreNamespace
): BaseStoreState<T> => {
  const namespaceSettings = loadNamespaceLocalStorage(
    ns,
    globalLayoutSettingsKey
  );
  const defaultPagination = getDefaultPagination();
  const tablePagination = {
    ...defaultPagination,
    ...namespaceSettings.pagination,
  };

  return {
    ns,
    dialogVisible: {
      createEdit: true,
    },
    activeDialogKey: undefined,
    form: {} as T,
    isSelectiveForm: false,
    selectedFormFields: [],
    readonlyFormFields: [],
    formList: [],
    newFormFn: emptyObjectFunc,
    confirmLoading: false,
    tableLoading: false,
    tableData: [],
    tableTotal: 0,
    tablePagination,
    tableListFilter: [],
    tableListSort: [],
    allList: [],
    sidebarCollapsed: false,
    actionsCollapsed: false,
    tabs: [{ id: 'overview', title: t('common.tabs.overview') }],
    disabledTabKeys: [],
    afterSave: [],
  };
};

export const getDefaultStoreGetters = <T = any>(
  opts?: GetDefaultStoreGettersOptions
): BaseStoreGetters<BaseStoreState<T>> => {
  if (!opts) opts = {};
  if (!opts.selectOptionValueKey) opts.selectOptionValueKey = '_id';
  if (!opts.selectOptionLabelKey) opts.selectOptionLabelKey = 'name';

  return {
    dialogVisible: (state: BaseStoreState<T>) =>
      state.activeDialogKey !== undefined,
    formListIds: (state: BaseStoreState<T>) =>
      state.formList.map(d => (d as BaseModel)._id as string),
    allListSelectOptions: (state: BaseStoreState<T>) =>
      state.allList.map(d => {
        const _d = d as BaseModel;
        return {
          value: _d[opts?.selectOptionValueKey as string],
          label: _d[opts?.selectOptionLabelKey as string],
        };
      }),
    allDict: (state: BaseStoreState<T>) => {
      const dict = new Map<string, T>();
      state.allList.forEach(d =>
        dict.set((d as BaseModel)._id as string, d as any)
      );
      return dict;
    },
  };
};

export const getDefaultStoreMutations = <T = any>(): BaseStoreMutations<T> => {
  return {
    showDialog: (state: BaseStoreState<T>, key: DialogKey) => {
      state.activeDialogKey = key;
    },
    hideDialog: (state: BaseStoreState<T>) => {
      // reset all other state variables
      state.isSelectiveForm = false;
      state.selectedFormFields = [];
      state.formList = [];
      state.confirmLoading = false;

      // set active dialog key as undefined
      state.activeDialogKey = undefined;
    },
    setForm: (state: BaseStoreState<T>, value: T) => {
      state.form = value;
    },
    resetForm: (state: BaseStoreState<T>) => {
      state.form = state.newFormFn() as T;
    },
    setIsSelectiveForm: (state: BaseStoreState<T>, value: boolean) => {
      state.isSelectiveForm = value;
    },
    setSelectedFormFields: (state: BaseStoreState<T>, value: string[]) => {
      state.selectedFormFields = value;
    },
    resetSelectedFormFields: (state: BaseStoreState<T>) => {
      state.selectedFormFields = [];
    },
    setReadonlyFormFields: (state: BaseStoreState<T>, value: string[]) => {
      state.readonlyFormFields = value;
    },
    resetReadonlyFormFields: (state: BaseStoreState<T>) => {
      state.readonlyFormFields = [];
    },
    setFormList: (state: BaseStoreState<T>, value: T[]) => {
      state.formList = value;
    },
    resetFormList: (state: BaseStoreState<T>) => {
      state.formList = [];
    },
    setConfirmLoading: (state: BaseStoreState<T>, value: boolean) => {
      state.confirmLoading = value;
    },
    setTableLoading: (state: BaseStoreState<T>, value: boolean) => {
      state.tableLoading = value;
    },
    setTableData: (
      state: BaseStoreState<T>,
      payload: TableDataWithTotal<T>
    ) => {
      const { data, total } = payload;
      state.tableData = data;
      state.tableTotal = total;
    },
    resetTableData: (state: BaseStoreState<T>) => {
      state.tableData = [];
    },
    setTablePagination: (
      state: BaseStoreState<T>,
      pagination: TablePagination
    ) => {
      state.tablePagination = pagination;
      saveNamespaceLocalStorage(state.ns, globalLayoutSettingsKey, {
        pagination,
      });
    },
    resetTablePagination: (state: BaseStoreState<T>) => {
      const pagination = getDefaultPagination();
      state.tablePagination = pagination;
      saveNamespaceLocalStorage(state.ns, globalLayoutSettingsKey, {
        pagination,
      });
    },
    setTableListFilter: (
      state: BaseStoreState<T>,
      filter: FilterConditionData[]
    ) => {
      state.tableListFilter = filter;
    },
    resetTableListFilter: (state: BaseStoreState<T>) => {
      state.tableListFilter = [];
    },
    setTableListFilterByKey: (
      state: BaseStoreState<T>,
      { key, conditions }
    ) => {
      const filter = state.tableListFilter.filter(d => d.key !== key);
      conditions.forEach(d => {
        d.key = key;
        filter.push(d);
      });
      state.tableListFilter = filter;
    },
    resetTableListFilterByKey: (state: BaseStoreState<T>, key) => {
      state.tableListFilter = state.tableListFilter.filter(d => d.key !== key);
    },
    setTableListSort: (state: BaseStoreState<T>, sort: SortData[]) => {
      state.tableListSort = sort;
    },
    resetTableListSort: (state: BaseStoreState<T>) => {
      state.tableListSort = [];
    },
    setTableListSortByKey: (state: BaseStoreState<T>, { key, sort }) => {
      const idx = state.tableListSort.findIndex(d => d.key === key);
      if (idx === -1) {
        if (sort) {
          state.tableListSort.push(sort);
        }
      } else {
        if (sort) {
          state.tableListSort[idx] = plainClone(sort);
        } else {
          state.tableListSort.splice(idx, 1);
        }
      }
    },
    resetTableListSortByKey: (state: BaseStoreState<T>, key) => {
      state.tableListSort = state.tableListSort.filter(d => d.key !== key);
    },
    setAllList: (state: BaseStoreState<T>, value: T[]) => {
      state.allList = value;
    },
    resetAllList: (state: BaseStoreState<T>) => {
      state.allList = [];
    },
    setTabs: (state: BaseStoreState<T>, tabs) => {
      state.tabs = tabs;
    },
    setDisabledTabKeys: (state: BaseStoreState<T>, keys) => {
      state.disabledTabKeys = keys;
    },
    resetDisabledTabKeys: (state: BaseStoreState<T>) => {
      state.disabledTabKeys = [];
    },
    setAfterSave: (state: BaseStoreState<T>, fnList) => {
      state.afterSave = fnList;
    },
  };
};

export const getDefaultStoreActions = <T = any>(
  endpoint: string
): {
  deleteList: (
    { commit }: StoreActionContext<BaseStoreState<T>>,
    ids: string[]
  ) => Promise<Response>;
  getAllList: ({
    commit,
  }: StoreActionContext<BaseStoreState<T>>) => Promise<ResponseWithListData<T>>;
  createList: (
    { state, commit }: StoreActionContext<BaseStoreState<T>>,
    data: T[]
  ) => Promise<ResponseWithListData<T>>;
  getById: (
    { commit }: StoreActionContext<BaseStoreState<T>>,
    id: string
  ) => Promise<ResponseWithData<T>>;
  getList: ({
    state,
    commit,
  }: StoreActionContext<BaseStoreState<T>>) => Promise<ResponseWithListData<T>>;
  deleteById: (
    { commit }: StoreActionContext<BaseStoreState<T>>,
    id: string
  ) => Promise<Response>;
  create: (
    { commit }: StoreActionContext<BaseStoreState<T>>,
    form: T
  ) => Promise<ResponseWithData<T>>;
  getListWithParams: (
    _: StoreActionContext<BaseStoreState<T>>,
    params?: ListRequestParams
  ) => Promise<ResponseWithListData<T>>;
  updateById: (
    { commit }: StoreActionContext<BaseStoreState<T>>,
    {
      id,
      form,
    }: {
      id: string;
      form: T;
    }
  ) => Promise<ResponseWithData<T>>;
  updateList: (
    { state, commit }: StoreActionContext<BaseStoreState<T>>,
    { ids, data, fields }: BatchRequestPayloadWithData
  ) => Promise<Response>;
} => {
  const {
    getById,
    create,
    updateById,
    deleteById,
    getList,
    getAll,
    createList,
    updateList,
    deleteList,
  } = useService<T>(endpoint);

  return {
    getById: async (
      { commit }: StoreActionContext<BaseStoreState<T>>,
      id: string
    ) => {
      const res = await getById(id);
      commit('setForm', res.data);
      return res;
    },
    create: async (_: StoreActionContext<BaseStoreState<T>>, form: T) => {
      return await create(form);
    },
    updateById: async (
      _: StoreActionContext<BaseStoreState<T>>,
      { id, form }: { id: string; form: T }
    ) => {
      return await updateById(id, form);
    },
    deleteById: async (
      _: StoreActionContext<BaseStoreState<T>>,
      id: string
    ) => {
      return await deleteById(id);
    },
    getList: async ({
      state,
      commit,
    }: StoreActionContext<BaseStoreState<T>>) => {
      const { page, size } = state.tablePagination;
      try {
        commit('setTableLoading', true);
        const res = await getList({
          page,
          size,
          conditions: JSON.stringify(state.tableListFilter),
          sort: JSON.stringify(state.tableListSort),
        } as ListRequestParams);

        // table data
        const tableData = { data: res.data || [], total: res.total };

        // check if the data has changes against the current data
        if (getMd5(tableData.data) !== getMd5(state.tableData)) {
          commit('setTableData', tableData);
        }
        return res;
      } catch (e) {
        throw e;
      } finally {
        commit('setTableLoading', false);
      }
    },
    getListWithParams: async (
      _: StoreActionContext<BaseStoreState<T>>,
      params?: ListRequestParams
    ) => {
      return await getList(params);
    },
    getAllList: async ({ commit }: StoreActionContext<BaseStoreState<T>>) => {
      const res = await getAll();
      commit('setAllList', res.data || []);
      return res;
    },
    createList: async (_: StoreActionContext<BaseStoreState<T>>, data: T[]) => {
      return await createList(data);
    },
    updateList: async (
      _: StoreActionContext<BaseStoreState<T>>,
      { ids, data, fields }: BatchRequestPayloadWithData
    ) => {
      return await updateList(ids, data, fields);
    },
    deleteList: async (
      _: StoreActionContext<BaseStoreState<T>>,
      ids: string[]
    ) => {
      return await deleteList(ids);
    },
  };
};
