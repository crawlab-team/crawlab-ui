declare const _default: import('vue').DefineComponent<
  {
    type: {
      type: StringConstructor;
    };
  },
  {
    dialogVisible: import('vue').Ref<{
      logs: boolean;
    }>;
    tableColumns: import('vue').ComputedRef<TableColumns<EnvDepsTask>>;
    tableData: import('vue').Ref<
      {
        [x: string]: any;
        status?: string | undefined;
        error?: string | undefined;
        setting_id?: string | undefined;
        type?: string | undefined;
        node_id?: string | undefined;
        action?: string | undefined;
        dep_names?: string[] | undefined;
        upgrade?: boolean | undefined;
        update_ts?: string | undefined;
        _id?: string | undefined;
        created_ts?: string | undefined;
        created_by?: string | undefined;
        updated_at?: string | undefined;
        updated_ts?: string | undefined;
      }[]
    >;
    tablePagination: import('vue').Ref<{
      page: number;
      size: number;
    }>;
    tableTotal: import('vue').Ref<number>;
    onPaginationChange: (pagination: TablePagination) => void;
    getList: () => Promise<void>;
    logs: import('vue').Ref<
      {
        [x: string]: any;
        task_id?: string | undefined;
        content?: string | undefined;
        update_ts?: string | undefined;
        _id?: string | undefined;
        created_ts?: string | undefined;
        created_by?: string | undefined;
        updated_at?: string | undefined;
        updated_ts?: string | undefined;
      }[]
    >;
    onLogsClose: () => void;
    t: (path: string, number?: any, args?: Record<string, any>) => string;
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<{
      type: {
        type: StringConstructor;
      };
    }>
  >,
  {},
  {}
>;
export default _default;
