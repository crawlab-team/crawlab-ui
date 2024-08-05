declare function __VLS_template(): {
    "nav-actions-extra"?(_: {}): any;
    extra?(_: {}): any;
};
declare const __VLS_component: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      navActions?: ListActionGroup[];
      rowKey?: string | ((row: any) => string);
      tableColumns: TableColumns;
      tableData: TableData;
      tableTotal?: number;
      tablePagination?: TablePagination;
      tableListFilter?: FilterConditionData[];
      tableListSort?: SortData[];
      tableActionsPrefix?: ListActionButton[];
      tableActionsSuffix?: ListActionButton[];
      tableFilter?: any;
      actionFunctions?: ListLayoutActionFunctions;
      noActions?: boolean;
      selectableFunction?: TableSelectableFunction;
      visibleButtons?: BuiltInTableActionButtonName[];
      tablePaginationLayout?: string;
      tableLoading?: boolean;
      tablePaginationPosition?: TablePaginationPosition;
      embedded?: boolean;
    }>,
    {
      navActions: () => never[];
      rowKey: string;
      tableColumns: () => never[];
      tableData: () => never[];
      tableTotal: number;
      tablePagination: () => {
        page: number;
        size: number;
      };
      tableListFilter: () => never[];
      tableListSort: () => never[];
      tableActionsPrefix: () => never[];
      tableActionsSuffix: () => never[];
      tableFilter: () => {};
      noActions: boolean;
      selectableFunction: () => true;
      visibleButtons: () => never[];
    }
  >,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    select: (value: TableData<TableAnyRowData>) => void;
    edit: (value: TableData<TableAnyRowData>) => void;
    delete: (value: TableData<TableAnyRowData>) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          navActions?: ListActionGroup[];
          rowKey?: string | ((row: any) => string);
          tableColumns: TableColumns;
          tableData: TableData;
          tableTotal?: number;
          tablePagination?: TablePagination;
          tableListFilter?: FilterConditionData[];
          tableListSort?: SortData[];
          tableActionsPrefix?: ListActionButton[];
          tableActionsSuffix?: ListActionButton[];
          tableFilter?: any;
          actionFunctions?: ListLayoutActionFunctions;
          noActions?: boolean;
          selectableFunction?: TableSelectableFunction;
          visibleButtons?: BuiltInTableActionButtonName[];
          tablePaginationLayout?: string;
          tableLoading?: boolean;
          tablePaginationPosition?: TablePaginationPosition;
          embedded?: boolean;
        }>,
        {
          navActions: () => never[];
          rowKey: string;
          tableColumns: () => never[];
          tableData: () => never[];
          tableTotal: number;
          tablePagination: () => {
            page: number;
            size: number;
          };
          tableListFilter: () => never[];
          tableListSort: () => never[];
          tableActionsPrefix: () => never[];
          tableActionsSuffix: () => never[];
          tableFilter: () => {};
          noActions: boolean;
          selectableFunction: () => true;
          visibleButtons: () => never[];
        }
      >
    >
  > & {
    onSelect?: ((value: TableData<TableAnyRowData>) => any) | undefined;
    onDelete?: ((value: TableData<TableAnyRowData>) => any) | undefined;
    onEdit?: ((value: TableData<TableAnyRowData>) => any) | undefined;
  },
  {
    navActions: ListActionGroup[];
    noActions: boolean;
    visibleButtons: BuiltInTableActionButtonName[];
    tableData: TableData;
    tableTotal: number;
    tablePagination: TablePagination;
    tableColumns: TableColumns;
    rowKey: string | ((row: any) => string);
    tableActionsPrefix: ListActionButton[];
    tableListFilter: FilterConditionData[];
    tableListSort: SortData[];
    selectableFunction: TableSelectableFunction;
    tableFilter: any;
    tableActionsSuffix: ListActionButton[];
  },
  {}
>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
