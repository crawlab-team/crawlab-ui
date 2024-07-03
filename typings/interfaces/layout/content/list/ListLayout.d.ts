import { ComputedRef, Ref } from 'vue';
import Table from '@/components/table/Table.vue';

export declare global {
  interface ListLayoutComponentData<T = any> {
    navActions?: Ref<ListActionGroup[]>;
    tableColumns?: Ref<TableColumns<T>>;
    tableData: Ref<TableData<T>>;
    tableTotal: Ref<number>;
    tablePagination: Ref<TablePagination>;
    tableListFilter: Ref<FilterConditionData[]>;
    tableListSort: Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: ComputedRef<DialogKey | undefined>;
  }

  interface UseListOptions<T> {
    navActions: Ref<ListActionGroup[]>;
    tableColumns: Ref<TableColumns<T>>;
  }

  interface ListActionGroup {
    name?: string;
    children?: (ListActionButton | ListActionFilter)[];
  }

  interface ListAction {
    id?: string;
    label?: string;
    action?: GenericAction;
    className?: string;
    size?: BasicSize;
  }

  interface ListActionButton extends ListAction {
    buttonType?: ButtonType;
    tooltip?: string;
    icon?: Icon;
    type?: BasicType;
    disabled?: boolean | ListActionButtonDisabledFunc;
    onClick?: () => void;
  }

  interface ListActionFilter extends ListAction {
    placeholder?: string;
    options?: SelectOption[];
    optionsRemote?: FilterSelectOptionsRemote;
    onChange?: (value: any) => void;
  }

  interface ListLayoutActionFunctions {
    setPagination: (pagination: TablePagination) => void;
    getList: () => Promise<void>;
    getAll: () => Promise<void>;
    deleteList: (ids: string[]) => Promise<Response | void>;
    deleteByIdConfirm: (row: BaseModel) => Promise<void>;
    onHeaderChange?: (
      column: TableColumn,
      sort: SortData,
      filter: TableHeaderDialogFilterData
    ) => Promise<void>;
  }

  type ListActionButtonDisabledFunc = (table: typeof Table) => boolean;
}
