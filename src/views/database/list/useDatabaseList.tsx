import { computed, h } from 'vue';
import { ElMessageBox } from 'element-plus';
import {
  ClNavLink,
  ClDatabaseDataSource,
  ClDatabaseStatus,
  useDatabase,
  ClIcon,
} from '@/components';
import useDataSourceService from '@/services/database/databaseService';
import {
  DATABASE_STATUS_OFFLINE,
  DATABASE_STATUS_ONLINE,
} from '@/constants/database';
import { getStore } from '@/store';
import {
  onListFilterChangeByKey,
  setupListComponent,
  translate,
} from '@/utils';
import { getRouter } from '@/router';
import {
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_VIEW,
  ACTION_VIEW_CONSOLE,
  ACTION_VIEW_DATABASES,
  ACTION_VIEW_MONITORING,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import { useList } from '@/layouts/content';

// i18n
const t = translate;

const useDatabaseList = () => {
  // router
  const router = getRouter();

  // store
  const ns = 'database';
  const store = getStore();
  const { commit } = store;

  const { dataSourceOptions } = useDatabase(store);

  // services
  const { getList, deleteById } = useDataSourceService(store);

  const statusSelectOptions: SelectOption[] = [
    {
      label: t('components.database.status.label.online'),
      value: DATABASE_STATUS_ONLINE,
    },
    {
      label: t('components.database.status.label.offline'),
      value: DATABASE_STATUS_OFFLINE,
    },
  ];

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      name: 'common',
      children: [
        {
          buttonType: 'label',
          label: t('views.database.navActions.new.label'),
          tooltip: t('views.database.navActions.new.tooltip'),
          icon: ['fa', 'plus'],
          type: 'success',
          onClick: () => {
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
          placeholder: t('views.database.navActions.filter.search.placeholder'),
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'name',
            FILTER_OP_CONTAINS
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-data-source',
          className: 'filter-select-data-source',
          label: t(
            'views.database.navActionsExtra.filter.select.dataSource.label'
          ),
          options: dataSourceOptions.value,
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'data_source',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-status',
          className: 'filter-select-status',
          label: t('views.database.navActionsExtra.filter.select.status.label'),
          options: statusSelectOptions,
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'status',
            FILTER_OP_EQUAL
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<Database>>(
    () =>
      [
        {
          key: 'name',
          label: t('components.database.form.name'),
          icon: ['fa', 'font'],
          width: '150',
          value: (row: Database) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ClNavLink
                path={`/databases/${row._id}`}
                label={
                  row.is_default
                    ? t('components.database.default.name')
                    : row.name
                }
              />
              {row.is_default ? (
                <ClIcon color="var(--cl-warning-color)" icon={['fa', 'star']} />
              ) : null}
            </div>
          ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: 'data_source',
          label: t('components.database.form.dataSource'),
          icon: ['fa', 'database'],
          width: '150',
          value: (row: Database) => (
            <ClDatabaseDataSource dataSource={row.data_source} />
          ),
        },
        {
          key: 'status', // status
          label: t('components.database.form.status'),
          icon: ['fa', 'heartbeat'],
          width: '120',
          value: (row: Database) => (
            <ClDatabaseStatus status={row.status} error={row.error} />
          ),
          hasFilter: true,
          allowFilterItems: true,
          filterItems: statusSelectOptions,
        },
        {
          key: 'description',
          label: t('components.database.form.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '200',
          buttons: [
            {
              tooltip: t('common.actions.view'),
              onClick: async row => {
                await router.push(`/databases/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.viewDatabases'),
              onClick: async row => {
                await router.push(`/databases/${row._id}/databases`);
              },
              action: ACTION_VIEW_DATABASES,
            },
            {
              tooltip: t('common.actions.viewConsole'),
              onClick: async row => {
                await router.push(`/databases/${row._id}/console`);
              },
              action: ACTION_VIEW_CONSOLE,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewMonitoring'),
              onClick: async row => {
                await router.push(`/databases/${row._id}/monitoring`);
              },
              action: ACTION_VIEW_MONITORING,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.delete'),
              disabled: (row: Database) => row.is_default,
              onClick: async (row: Database) => {
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
      ] as TableColumns<Database>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Database>;

  setupListComponent(ns, store, [], true);

  const selectableFunction: TableSelectableFunction<Database> = (
    row: Database
  ) => {
    return !row.is_default;
  };

  return {
    ...useList<Database>(ns, store, opts),
    selectableFunction,
  };
};

export default useDatabaseList;
