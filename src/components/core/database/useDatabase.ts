import { Store } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  DATABASE_CONNECT_TYPE_HOSTS,
  DATABASE_CONNECT_TYPE_STANDARD,
  DATABASE_CONNECT_TYPE_URL,
  DATABASE_TYPE_MONGO,
  DATABASE_TYPE_MYSQL,
  DATABASE_TYPE_POSTGRESQL,
  DATABASE_TYPE_MSSQL,
  DATABASE_TYPE_ELASTICSEARCH,
  DATABASE_TYPE_KAFKA,
} from '@/constants/database';
import useDatabaseService from '@/services/database/databaseService';
import { getDefaultFormComponentData, plainClone, translate } from '@/utils';
import useForm from '@/components/ui/form/useForm';

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

  // type options
  const dataSourceOptions: SelectOption[] = [
    {
      label: t('components.database.dataSources.mongo'),
      value: DATABASE_TYPE_MONGO,
    },
    {
      label: t('components.database.dataSources.mysql'),
      value: DATABASE_TYPE_MYSQL,
    },
    {
      label: t('components.database.dataSources.postgresql'),
      value: DATABASE_TYPE_POSTGRESQL,
    },
    {
      label: t('components.database.dataSources.mssql'),
      value: DATABASE_TYPE_MSSQL,
    },
    {
      label: t('components.database.dataSources.elasticsearch'),
      value: DATABASE_TYPE_ELASTICSEARCH,
    },
    {
      label: t('components.database.dataSources.kafka'),
      value: DATABASE_TYPE_KAFKA,
    },
  ];
  const getTypeOptionsWithDefault = (): SelectOption[] => {
    return [
      { label: t('components.database.dataSources.default'), value: undefined },
      ...dataSourceOptions,
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

  return {
    ...useForm(ns, store, useDatabaseService(store), formComponentData),
    formRules,
    dataSourceOptions,
    getTypeOptionsWithDefault,
    onChangePasswordFunc,
    onHostsAdd,
    onHostsDelete,
  };
};

export default useDatabase;
