import { Ref } from 'vue';

declare const useAction: (
  emit: Function,
  table: Ref,
  actionFunctions?: ListLayoutActionFunctions
) => {
  selection: Ref<TableAnyRowData[]>;
  onSelectionChange: (value: TableData) => void;
  onAdd: () => void;
  onEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
  onExport: () => void;
  clearSelection: () => void;
};
export default useAction;
