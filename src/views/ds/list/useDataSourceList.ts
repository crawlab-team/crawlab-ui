import { computed, h } from 'vue';
import { ElMessageBox } from 'element-plus';
import DataSourceType from '@/components/ds/DataSourceType.vue';
import useDataSourceService from '@/services/ds/dataSourceService';
import {
  DATA_SOURCE_CONNECT_TYPE_HOSTS,
  DATA_SOURCE_CONNECT_TYPE_STANDARD,
  DATA_SOURCE_CONNECT_TYPE_URL,
  DATA_SOURCE_STATUS_OFFLINE,
  DATA_SOURCE_STATUS_ONLINE,
  DATA_SOURCE_TYPE_COCKROACHDB,
  DATA_SOURCE_TYPE_ELASTICSEARCH,
  DATA_SOURCE_TYPE_KAFKA,
  DATA_SOURCE_TYPE_MONGO,
  DATA_SOURCE_TYPE_MSSQL,
  DATA_SOURCE_TYPE_MYSQL,
  DATA_SOURCE_TYPE_POSTGRESQL,
  DATA_SOURCE_TYPE_SQLITE,
} from '@/constants/ds';
import DataSourceStatus from '@/components/ds/DataSourceStatus.vue';
import DataSourceConnectType from '@/components/ds/DataSourceConnectType.vue';
import { getStore } from '@/store';
import { onListFilterChangeByKey, translate } from '@/utils';
import { getRouter } from '@/router';
import {
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import { ClNavLink, ClTag } from '@/components';
import { useList } from '@/layouts/content';

// i18n
const t = translate;

const useDataSourceList = () => {
  // router
  const router = getRouter();

  // store
  const ns = 'ds';
  const store = getStore<RootStoreState>();
  const { commit } = store;

  // services
  const { getList, deleteById } = useDataSourceService(store);

  const typeSelectOptions: SelectOption[] = [
    { label: t('components.ds.type.mongo'), value: DATA_SOURCE_TYPE_MONGO },
    { label: t('components.ds.type.mysql'), value: DATA_SOURCE_TYPE_MYSQL },
    {
      label: t('components.ds.type.postgresql'),
      value: DATA_SOURCE_TYPE_POSTGRESQL,
    },
    { label: t('components.ds.type.mssql'), value: DATA_SOURCE_TYPE_MSSQL },
    { label: t('components.ds.type.sqlite'), value: DATA_SOURCE_TYPE_SQLITE },
    {
      label: t('components.ds.type.cockroachdb'),
      value: DATA_SOURCE_TYPE_COCKROACHDB,
    },
    {
      label: t('components.ds.type.elasticsearch'),
      value: DATA_SOURCE_TYPE_ELASTICSEARCH,
    },
    { label: t('components.ds.type.kafka'), value: DATA_SOURCE_TYPE_KAFKA },
  ];

  const statusSelectOptions: SelectOption[] = [
    {
      label: t('components.ds.status.label.online'),
      value: DATA_SOURCE_STATUS_ONLINE,
    },
    {
      label: t('components.ds.status.label.offline'),
      value: DATA_SOURCE_STATUS_OFFLINE,
    },
  ];

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      name: 'common',
      children: [
        {
          buttonType: 'label',
          label: t('views.ds.navActions.new.label'),
          tooltip: t('views.ds.navActions.new.tooltip'),
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
          placeholder: t('views.ds.navActions.filter.search.placeholder'),
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'name',
            FILTER_OP_CONTAINS
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-type',
          className: 'filter-select-type',
          label: t('views.ds.navActionsExtra.filter.select.type.label'),
          options: typeSelectOptions,
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'type',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-status',
          className: 'filter-select-status',
          label: t('views.ds.navActionsExtra.filter.select.status.label'),
          options: statusSelectOptions,
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'status',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SEARCH,
          id: 'filter-search-connect-settings',
          className: 'search-connect-settings',
          placeholder: t(
            'views.ds.navActionsExtra.filter.search.connectSettings.placeholder'
          ),
          onChange: onListFilterChangeByKey(
            store,
            ns as any,
            'connect_settings',
            FILTER_OP_CONTAINS
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<DataSource>>(() => [
    {
      key: 'name',
      label: t('components.ds.form.name'),
      icon: ['fa', 'font'],
      width: '150',
      value: (row: DataSource) =>
        h(ClNavLink, {
          path: `/data-sources/${row._id}`,
          label: row.name,
        }),
      hasSort: true,
      hasFilter: true,
      allowFilterSearch: true,
    },
    {
      key: 'type',
      label: t('components.ds.form.type'),
      icon: ['fa', 'database'],
      width: '150',
      value: (row: DataSource) =>
        h(DataSourceType, {
          dataSource: row,
        }),
    },
    {
      key: 'status', // status
      label: t('components.ds.form.status'),
      icon: ['fa', 'heartbeat'],
      width: '120',
      value: (row: DataSource) => {
        return h(DataSourceStatus, {
          status: row.status,
          error: row.error,
        } as DataSourceStatusProps);
      },
      hasFilter: true,
      allowFilterItems: true,
      filterItems: statusSelectOptions,
    },
    {
      key: 'connect_type',
      label: t('components.ds.form.connectType'),
      icon: ['fa', 'wifi'],
      width: '120',
      value: (row: DataSource) => {
        return h(DataSourceConnectType, {
          dataSource: row,
        } as DataSourceConnectTypeProps);
      },
    },
    {
      key: 'connect_settings',
      label: t('components.ds.form.connectSettings'),
      icon: ['fa', 'map-marker-alt'],
      width: '210',
      value: (row: DataSource) => {
        let label: string | undefined;
        switch (row.connect_type) {
          case DATA_SOURCE_CONNECT_TYPE_STANDARD:
            label = `${row.host || '<' + t('components.ds.default.host') + '>'}:${row.port || '<' + t('components.ds.default.port') + '>'}`;
            return h(ClTag, {
              label,
            });
          case DATA_SOURCE_CONNECT_TYPE_URL:
            label = row.url;
            return h(ClTag, {
              label,
            });
          case DATA_SOURCE_CONNECT_TYPE_HOSTS:
            return row.hosts?.map(address => {
              label = address;
              return h(ClTag, {
                label: address,
              });
            });
        }
      },
    },
    {
      key: 'database',
      label: t('components.ds.form.database'),
      icon: ['fa', 'database'],
      width: '150',
    },
    {
      key: 'username',
      label: t('components.ds.form.username'),
      icon: ['fa', 'key'],
      width: '180',
    },
    {
      key: 'description',
      label: t('components.ds.form.description'),
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
          type: 'primary',
          icon: ['fa', 'search'],
          tooltip: t('common.actions.view'),
          onClick: row => {
            router.push(`/data-sources/${row._id}`);
          },
        },
        {
          type: 'danger',
          size: 'small',
          icon: ['fa', 'trash-alt'],
          tooltip: t('common.actions.delete'),
          onClick: async (row: DataSource) => {
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
        },
      ],
      disableTransfer: true,
    },
  ]);

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<DataSource>;

  return {
    ...useList<DataSource>(ns, store, opts),
  };
};

export default useDataSourceList;
