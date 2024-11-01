import { computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import useEnvironmentService from '@/services/environment/environmentService';
import { getStore } from '@/store';
import { onListFilterChangeByKey, translate } from '@/utils';
import {
  ACTION_DELETE,
  ACTION_EDIT,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  FILTER_OP_CONTAINS,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import { useList } from '@/layouts/content';

// i18n
const t = translate;

const useEnvironmentList = () => {
  // store
  const ns = 'environment';
  const store = getStore();
  const { commit } = store;

  // services
  const { getList, deleteById } = useEnvironmentService(store);

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      name: 'common',
      children: [
        {
          buttonType: 'label',
          label: t('views.environment.navActions.new.label'),
          tooltip: t('views.environment.navActions.new.tooltip'),
          icon: ['fa', 'plus'],
          type: 'success',
          onClick: async () => {
            commit(`${ns}/showDialog`, 'create');
          },
        },
      ],
    },
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SEARCH,
          id: 'filter-search',
          className: 'search',
          placeholder: t(
            'views.environment.navActions.filter.search.placeholder'
          ),
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'key',
            FILTER_OP_CONTAINS
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<Environment>>(() => [
    {
      key: 'key',
      label: t('views.environment.table.columns.key'),
      icon: ['fa', 'font'],
      width: '240',
      hasSort: true,
      hasFilter: true,
      allowFilterSearch: true,
    },
    {
      key: 'value',
      label: t('views.environment.table.columns.value'),
      icon: ['fa', 'hashtag'],
      width: 'auto',
    },
    {
      key: TABLE_COLUMN_NAME_ACTIONS,
      label: t('components.table.columns.actions'),
      fixed: 'right',
      width: '200',
      buttons: [
        {
          tooltip: t('common.actions.edit'),
          onClick: async (row: Environment) => {
            commit(`${ns}/setForm`, row);
            commit(`${ns}/showDialog`, 'edit');
          },
          action: ACTION_EDIT,
        },
        {
          tooltip: t('common.actions.delete'),
          onClick: async (row: Environment) => {
            const res = await ElMessageBox.confirm(
              t('common.messageBox.confirm.delete'),
              t('common.actions.delete'),
              {
                type: 'warning',
                confirmButtonClass: 'el-button--danger',
              }
            );

            if (res) {
              await deleteById(row._id as string);
            }
            await getList();
          },
          action: ACTION_DELETE,
          contextMenu: true,
        },
      ],
      disableTransfer: true,
    },
  ]);

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Environment>;

  return {
    ...useList<Environment>(ns, store, opts),
  };
};

export default useEnvironmentList;
