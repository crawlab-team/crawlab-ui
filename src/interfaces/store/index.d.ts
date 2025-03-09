import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
  Store,
} from 'vuex';

export declare global {
  interface RootStoreState {
    common: CommonStoreState;
    layout: LayoutStoreState;
    file: FileStoreState;
    node: NodeStoreState;
    project: ProjectStoreState;
    spider: SpiderStoreState;
    task: TaskStoreState;
    dataCollection: DataCollectionStoreState;
    schedule: ScheduleStoreState;
    user: UserStoreState;
    role: RoleStoreState;
    token: TokenStoreState;
    git: GitStoreState;
    notificationSetting: NotificationSettingStoreState;
    notificationChannel: NotificationChannelStoreState;
    notificationRequest: NotificationRequestStoreState;
    notificationAlert: NotificationAlertStoreState;
    database: DatabaseStoreState;
    dependency: DependencyStoreState;
    environment: EnvironmentStoreState;
    ai: AiStoreState;
    system: SystemStoreState;
  }

  type StoreGetter<S, T, R = RootStoreState> = (
    state: S,
    getters?: GetterTree<S, R>,
    rootState?: R,
    rootGetters?: any
  ) => T;

  type StoreMutation<S, P> = (state: S, payload: P) => void;

  type StoreActionHandler<S, P, T, R = RootStoreState> = (
    this: Store<R>,
    ctx: ActionContext<S, R>,
    payload?: P
  ) => T;

  interface StoreActionObject<S, P, T> {
    root?: boolean;
    handler: StoreActionHandler<S, P, T>;
  }

  type StoreAction<S, P, T> =
    | StoreActionHandler<S, P, T>
    | StoreActionObject<S, P, T>;

  interface BaseModule<S, G = any, M = any, A = any, R = RootStoreState>
    extends Module<S, R> {
    getters: G;
    mutations: M;
    actions: A;
  }

  interface BaseStoreState<T = any> {
    ns: StoreNamespace;
    dialogVisible: DialogVisible;
    activeDialogKey: DialogKey | undefined;
    form: T;
    isSelectiveForm: boolean;
    selectedFormFields: string[];
    readonlyFormFields: string[];
    formList: T[];
    newFormFn: DefaultFormFunc<T | {}>;
    confirmLoading: boolean;
    tableLoading: boolean;
    tableData: TableData<T>;
    tableTotal: number;
    tablePagination: TablePagination;
    tableListFilter: FilterConditionData[];
    tableListSort: SortData[];
    allList: T[];
    sidebarCollapsed: boolean;
    actionsCollapsed: boolean;
    tabs: NavItem[];
    disabledTabKeys: string[];
    afterSave: (() => Promise)[];
  }

  interface BaseStoreGetters<S = BaseStoreState, R = RootStoreState, T = any>
    extends GetterTree<S, R> {
    dialogVisible: StoreGetter<BaseStoreState, boolean>;
    formListIds: StoreGetter<BaseStoreState, string[]>;
    allListSelectOptions: StoreGetter<BaseStoreState, SelectOption[]>;
    allDict: StoreGetter<BaseStoreState, Map<string, T>>;
  }

  interface BaseStoreMutations<T = any>
    extends MutationTree<BaseStoreState<T>> {
    showDialog: StoreMutation<BaseStoreState<T>, DialogKey>;
    hideDialog: StoreMutation<BaseStoreState<T>>;
    setForm: StoreMutation<BaseStoreState<T>, T>;
    resetForm: StoreMutation<BaseStoreState<T>>;
    setIsSelectiveForm: StoreMutation<BaseStoreState<T>, boolean>;
    setSelectedFormFields: StoreMutation<BaseStoreState<T>, string[]>;
    resetSelectedFormFields: StoreMutation<BaseStoreState<T>>;
    setReadonlyFormFields: StoreMutation<BaseStoreState<T>, string[]>;
    resetReadonlyFormFields: StoreMutation<BaseStoreState<T>>;
    setFormList: StoreMutation<BaseStoreState<T>, T[]>;
    resetFormList: StoreMutation<BaseStoreState<T>>;
    setConfirmLoading: StoreMutation<BaseStoreState<T>, boolean>;
    setTableLoading: StoreMutation<BaseStoreState<T>, boolean>;
    setTableData: StoreMutation<BaseStoreState<T>, TableDataWithTotal<T>>;
    resetTableData: StoreMutation<BaseStoreState<T>>;
    setTablePagination: StoreMutation<BaseStoreState<T>, TablePagination>;
    resetTablePagination: StoreMutation<BaseStoreState<T>>;
    setTableListFilter: StoreMutation<BaseStoreState<T>, FilterConditionData[]>;
    resetTableListFilter: StoreMutation<BaseStoreState<T>>;
    setTableListFilterByKey: StoreMutation<
      BaseStoreState<T>,
      { key: string; conditions: FilterConditionData[] }
    >;
    resetTableListFilterByKey: StoreMutation<BaseStoreState<T>, string>;
    setTableListSort: StoreMutation<BaseStoreState<T>, SortData[]>;
    resetTableListSort: StoreMutation<BaseStoreState<T>>;
    setTableListSortByKey: StoreMutation<
      BaseStoreState<T>,
      { key: string; sort: SortData }
    >;
    resetTableListSortByKey: StoreMutation<BaseStoreState<T>, string>;
    setAllList: StoreMutation<BaseStoreState<T>, T[]>;
    resetAllList: StoreMutation<BaseStoreState<T>>;
    setTabs: StoreMutation<BaseStoreState, NavItem[]>;
    setDisabledTabKeys: StoreMutation<BaseStoreState, string[]>;
    resetDisabledTabKeys: StoreMutation<BaseStoreState, string[]>;
    setAfterSave: StoreMutation<BaseStoreState<T>, (() => Promise)[]>;
  }

  interface BaseStoreActions<T = any, R = RootStoreState>
    extends ActionTree<BaseStoreState<T>, R> {
    getById: StoreAction<BaseStoreState<T>, string>;
    create: StoreAction<BaseStoreState<T>, T>;
    updateById: StoreAction<BaseStoreState<T>, { id: string; form: T }>;
    deleteById: StoreAction<BaseStoreState<T>, string>;
    getList: StoreAction<BaseStoreState<T>>;
    getListWithParams: StoreAction<BaseStoreState<T>, ListRequestParams>;
    getAllList: StoreAction<BaseStoreState<T>>;
    createList: StoreAction<BaseStoreState<T>, T[]>;
    updateList: StoreAction<BaseStoreState<T>, BatchRequestPayloadWithData<T>>;
    deleteList: StoreAction<BaseStoreState<T>, BatchRequestPayload>;
  }

  type StoreActionContext<
    S = BaseStoreState,
    R = RootStoreState,
  > = ActionContext<S, R>;

  type ListStoreNamespace =
    | 'node'
    | 'project'
    | 'spider'
    | 'task'
    | 'schedule'
    | 'user'
    | 'role'
    | 'token'
    | 'git'
    | 'notificationSetting'
    | 'notificationChannel'
    | 'notificationRequest'
    | 'notificationAlert'
    | 'database'
    | 'dependency'
    | 'environment'
    | 'llmProvider';
  type StoreNamespace = ListStoreNamespace | 'layout' | 'common';

  interface StoreContext<T, R = RootStoreState> {
    namespace: StoreNamespace;
    store: Store<R>;
    state: BaseStoreState<T>;
  }

  interface ListStoreContext<T, R = RootStoreState> extends StoreContext<T> {
    namespace: ListStoreNamespace;
    state: R[ListStoreNamespace];
  }

  type DetailStoreContext<T> = ListStoreContext<T>;

  interface GetDefaultStoreGettersOptions {
    selectOptionValueKey?: string;
    selectOptionLabelKey?: string;
  }
}
