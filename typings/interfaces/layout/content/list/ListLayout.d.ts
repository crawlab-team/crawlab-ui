import { ComputedRef, Ref } from 'vue';
import Table from '@/components/ui/table/Table.vue';
import { ButtonType } from '@/components/ui/button/types';

export declare global {
  interface ListLayoutComponentData<T extends BaseModel> {
    navActions?: Ref<ListActionGroup[]>;
    tableLoading: Ref<boolean>;
    tableColumns?: Ref<TableColumns<T>>;
    tableData: Ref<TableData<T>>;
    tableTotal: Ref<number>;
    tablePagination: Ref<TablePagination>;
    tableListFilter: Ref<FilterConditionData[]>;
    tableListSort: Ref<SortData[]>;
    actionFunctions: ListLayoutActionFunctions;
    activeDialogKey: ComputedRef<DialogKey | undefined>;
  }

  interface UseListOptions<T extends BaseModel> {
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
    prefixIcon?: Icon;
    action?: string;
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
    defaultValue?: any;
    placeholder?: string;
    options?: SelectOption[];
    optionsRemote?: FilterSelectOptionsRemote;
    clearable?: boolean;
    onChange?: (value: any) => void;
    onEnter?: (value: any) => void;
    noAllOption?: boolean;
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
