declare function __VLS_template(): {
  'actions-prefix'?(_: {}): any;
  'actions-suffix'?(_: {}): any;
};

declare const __VLS_component: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      data: TableData;
      columns: TableColumn[];
      selectedColumnKeys?: string[];
      total?: number;
      page?: number;
      pageSize?: number;
      rowKey?: string | ((row: any) => string);
      selectable?: boolean;
      visibleButtons?: BuiltInTableActionButtonName[];
      hideFooter?: boolean;
      selectableFunction?: TableSelectableFunction;
      paginationLayout?: string;
      loading?: boolean;
      paginationPosition?: TablePaginationPosition;
      height?: string | number;
      maxHeight?: string | number;
      embedded?: boolean;
      border?: boolean;
      fit?: boolean;
      emptyText?: string;
    }>,
    {
      data: () => never[];
      columns: () => never[];
      selectedColumnKeys: () => never[];
      total: number;
      page: number;
      pageSize: number;
      rowKey: string;
      visibleButtons: () => never[];
      paginationLayout: string;
      paginationPosition: string;
      border: boolean;
    }
  >,
  {
    clearSelection: () => void;
    checkAll: () => void;
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    edit: (data: TableData<TableAnyRowData>) => void;
    delete: (data: TableData<TableAnyRowData>) => void;
    export: (data: TableData<TableAnyRowData>) => void;
    'header-change': (
      data: TableColumn<any>,
      sort: SortData,
      filter: FilterConditionData[]
    ) => void;
    'pagination-change': (data: TablePagination) => void;
    'selection-change': (data: TableData<TableAnyRowData>) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          data: TableData;
          columns: TableColumn[];
          selectedColumnKeys?: string[];
          total?: number;
          page?: number;
          pageSize?: number;
          rowKey?: string | ((row: any) => string);
          selectable?: boolean;
          visibleButtons?: BuiltInTableActionButtonName[];
          hideFooter?: boolean;
          selectableFunction?: TableSelectableFunction;
          paginationLayout?: string;
          loading?: boolean;
          paginationPosition?: TablePaginationPosition;
          height?: string | number;
          maxHeight?: string | number;
          embedded?: boolean;
          border?: boolean;
          fit?: boolean;
          emptyText?: string;
        }>,
        {
          data: () => never[];
          columns: () => never[];
          selectedColumnKeys: () => never[];
          total: number;
          page: number;
          pageSize: number;
          rowKey: string;
          visibleButtons: () => never[];
          paginationLayout: string;
          paginationPosition: string;
          border: boolean;
        }
      >
    >
  > & {
    onDelete?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onEdit?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    onExport?: ((data: TableData<TableAnyRowData>) => any) | undefined;
    'onPagination-change'?: ((data: TablePagination) => any) | undefined;
    'onHeader-change'?:
      | ((
          data: TableColumn<any>,
          sort: SortData,
          filter: FilterConditionData[]
        ) => any)
      | undefined;
    'onSelection-change'?:
      | ((data: TableData<TableAnyRowData>) => any)
      | undefined;
  },
  {
    data: TableData;
    columns: TableColumn[];
    total: number;
    page: number;
    visibleButtons: BuiltInTableActionButtonName[];
    rowKey: string | ((row: any) => string);
    pageSize: number;
    selectedColumnKeys: string[];
    paginationLayout: string;
    paginationPosition: TablePaginationPosition;
    border: boolean;
  },
  {}
>;
declare const _default: __VLS_WithTemplateSlots<
  typeof __VLS_component,
  ReturnType<typeof __VLS_template>
>;
export default _default;
type __VLS_WithDefaults<P, D> = {
  [K in keyof Pick<P, keyof P>]: K extends keyof D
    ? __VLS_Prettify<
        P[K] & {
          default: D[K];
        }
      >
    : P[K];
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
  [K in keyof T]-?: {} extends Pick<T, K>
    ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
      }
    : {
        type: import('vue').PropType<T[K]>;
        required: true;
      };
};
