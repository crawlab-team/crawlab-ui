import { inject, Ref, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { voidAsyncFunc } from '@/utils/func';
import { translate } from '@/utils/i18n';

const t = translate;

const useAction = (
  emit: Function,
  table: Ref,
  actionFunctions?: ListLayoutActionFunctions
) => {
  // store context
  const storeContext = inject<ListStoreContext<BaseModel>>('store-context');
  const ns = storeContext?.namespace;
  const store = storeContext?.store;

  // table selection
  const selection = ref<TableData>([]);
  const onSelectionChange = (value: TableData) => {
    selection.value = value;
    emit('selection-change', value);
  };

  // action functions
  const getList = actionFunctions?.getList || voidAsyncFunc;
  const deleteList = actionFunctions?.deleteList || voidAsyncFunc;

  const onAdd = () => {
    emit('add');
  };

  const onEdit = async () => {
    emit('edit', selection.value);
    if (storeContext) {
      store?.commit(`${ns}/showDialog`, 'edit');
      store?.commit(`${ns}/setIsSelectiveForm`, true);
      store?.commit(`${ns}/setFormList`, selection.value);
    }
  };

  const onDelete = async () => {
    const res = await ElMessageBox.confirm(
      t('common.messageBox.confirm.delete'),
      t('components.table.actions.deleteSelected'),
      {
        type: 'warning',
        confirmButtonText: t('common.actions.delete'),
        confirmButtonClass: 'el-button--danger',
      }
    );
    if (!res) return;
    const ids = selection.value.map(d => d._id as string);
    await deleteList(ids);
    ElMessage.success(t('common.message.success.delete'));
    table.value?.store?.clearSelection();
    await getList();
    emit('delete', selection.value);
  };

  const onExport = () => {
    emit('export');
  };

  const clearSelection = () => {
    table.value?.store?.clearSelection();
  };

  return {
    // public variables and methods
    selection,
    onSelectionChange,
    onAdd,
    onEdit,
    onDelete,
    onExport,
    clearSelection,
  };
};

export default useAction;
