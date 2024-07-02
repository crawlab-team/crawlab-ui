import { Ref } from 'vue';

declare global {
  type CreateEditDialogType = 'create' | 'edit';

  type CreateEditTabName = 'single' | 'batch';

  interface CreateEditDialogActionFunctions {
    onClose: () => void;
    onConfirm: () => Promise<void>;
    onTabChange: (value: CreateEditTabName) => void;
    onAdd: (rowIndex: number) => void;
    onClone: (rowIndex: number) => void;
    onDelete: (rowIndex: number) => void;
    onFieldChange: (rowIndex: number, prop: string, value: any) => void;
    onFieldRegister: (rowIndex: number, prop: string, formRef: Ref) => void;
  }
}
