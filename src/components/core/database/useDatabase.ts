import { computed } from 'vue';
import { Store } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import useDatabaseService from '@/services/database/databaseService';
import {
  EMPTY_OBJECT_ID,
  getDefaultFormComponentData,
  plainClone,
  translate,
} from '@/utils';
import useForm from '@/components/ui/form/useForm';
import { databaseDefaults } from '@/utils/database';

// i18n
const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<Database>();

export const useDatabase = (store: Store<RootStoreState>) => {
  // store
  const ns = 'database' as ListStoreNamespace;
  const { database: state } = store.state as RootStoreState;

  // form rules
  const formRules: FormRules = {};

  const availableDatabaseNames: DatabaseDataSource[] = [
    'mongo',
    'mysql',
    'postgres',
    'mssql',
    'elasticsearch',
  ];

  // type options
  const dataSourceOptions = computed<SelectOption<DatabaseDataSource>[]>(() =>
    databaseDefaults.map(item => {
      const disabled = !availableDatabaseNames.includes(item.data_source!);
      const label = !disabled
        ? item.name
        : `${item.name} (${t('common.status.currentlyUnavailable')})`;
      const value = item.data_source;
      return {
        label,
        value,
        disabled,
      };
    })
  );
  const getTypeOptionsWithDefault = (): SelectOption[] => {
    return [
      { label: t('components.database.dataSources.default'), value: undefined },
      ...dataSourceOptions.value,
    ];
  };

  // on change password function
  const onChangePasswordFunc = async (id?: string) => {
    if (!id) return;

    const { value } = await ElMessageBox.prompt(
      t('components.user.messageBox.prompt.changePassword'),
      t('components.user.form.changePassword'),
      {
        inputType: 'password',
        inputPlaceholder: t('components.user.form.newPassword'),
      }
    );

    await store.dispatch(`${ns}/changePassword`, { id, password: value });
    ElMessage.success(t('common.message.success.save'));
  };

  // on hosts add
  const onHostsAdd = (index: number) => {
    const form = plainClone(state.form);
    if (!form.hosts) form.hosts = [];
    form.hosts?.splice(index + 1, 0, '');
    store.commit(`${ns}/setForm`, { ...form });
  };

  // on hosts delete
  const onHostsDelete = (index: number) => {
    const form = plainClone(state.form);
    form.hosts?.splice(index, 1);
    if (form.hosts?.length === 0) form.hosts?.push('');
    store.commit(`${ns}/setForm`, { ...form });
  };

  const allListSelectOptions = computed<SelectOption[]>(
    () =>
      store.getters[`${ns}/allListSelectOptions`]?.map((op: SelectOption) => {
        if (op.value === EMPTY_OBJECT_ID) {
          return { ...op, label: t('components.database.default.name') };
        }
        return op;
      }) || []
  );

  return {
    ...useForm<Database>(
      ns,
      store,
      useDatabaseService(store),
      formComponentData
    ),
    formRules,
    dataSourceOptions,
    allListSelectOptions,
    getTypeOptionsWithDefault,
    onChangePasswordFunc,
    onHostsAdd,
    onHostsDelete,
  };
};

export default useDatabase;
