import { Store } from 'vuex';
import { Ref } from 'vue';

export declare const useFormTable: (
  ns: ListStoreNamespace,
  store: Store<RootStoreState>,
  services: Services<BaseModel>,
  data: FormComponentData<BaseModel>
) => {
  onAdd: (index: number) => void;
  onClone: (index: number) => void;
  onDelete: (index: number) => void;
  onFieldChange: (rowIndex: number, prop: string, value: any) => void;
  onFieldRegister: (rowIndex: number, prop: string, formRef: Ref) => void;
};
export default useFormTable;
