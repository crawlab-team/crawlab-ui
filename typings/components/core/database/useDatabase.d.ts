import { Store } from 'vuex';

export declare const useDatabase: (store: Store<RootStoreState>) => {
  formRules: FormRules;
  typeOptions: SelectOption<any>[];
  getTypeOptionsWithDefault: () => SelectOption[];
  onChangePasswordFunc: (id?: string) => Promise<void>;
  onConnectTypeChange: (connectType: DatabaseConnectType) => void;
  onHostsAdd: (index: number) => void;
  onHostsDelete: (index: number) => void;
  getNewForm: DefaultFormFunc<any>;
  getNewFormList: () => any[];
  form: import('vue').ComputedRef<BaseModel>;
  formRef: import('vue').Ref<any>;
  isSelectiveForm: import('vue').ComputedRef<boolean>;
  selectedFormFields: import('vue').ComputedRef<string[]>;
  formList: import('vue').ComputedRef<BaseModel[]>;
  validateForm: () => Promise<any>;
  resetForm: () => void;
  isFormItemDisabled: (prop: string) => boolean;
  activeDialogKey: import('vue').ComputedRef<DialogKey | undefined>;
  createEditDialogVisible: import('vue').ComputedRef<boolean>;
  allListSelectOptions: import('vue').ComputedRef<SelectOption<any>[]>;
  allListSelectOptionsWithEmpty: import('vue').ComputedRef<SelectOption<any>[]>;
  allDict: import('vue').ComputedRef<Map<string, BaseModel>>;
  confirmDisabled: import('vue').ComputedRef<boolean>;
  confirmLoading: import('vue').ComputedRef<boolean>;
  setConfirmLoading: (value: boolean) => void;
  actionFunctions: CreateEditDialogActionFunctions;
  onAdd: (index: number) => void;
  onClone: (index: number) => void;
  onDelete: (index: number) => void;
  onFieldChange: (rowIndex: number, prop: string, value: any) => void;
  onFieldRegister: (
    rowIndex: number,
    prop: string,
    formRef: import('vue').Ref
  ) => void;
};
export default useDatabase;
