import { computed, h } from 'vue';
import { useStore } from 'vuex';
import {
  ACTION_FILTER,
  ACTION_FILTER_SELECT,
  ACTION_VIEW,
  FILTER_OP_EQUAL,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import {
  getPlaceholderColumn,
  onListFilterChangeByKey,
  setupListComponent,
  translate,
} from '@/utils';
import { useList } from '@/layouts';
import {
  ClNotificationRequestStatus,
  ClTime,
  ClNavLink,
  ClTag,
} from '@/components';

const t = translate;

const useNotificationRequestList = () => {
  // store
  const ns: ListStoreNamespace = 'notificationRequest';
  const store = useStore<RootStoreState>();

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-setting',
          className: 'filter-select-setting',
          label: t(
            'views.notification.requests.navActionsExtra.filter.select.setting.label'
          ),
          optionsRemote: {
            colName: 'notification_settings',
          },
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'setting_id',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-channel',
          className: 'filter-select-channel',
          label: t(
            'views.notification.requests.navActionsExtra.filter.select.channel.label'
          ),
          optionsRemote: {
            colName: 'notification_channels',
          },
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'channel_id',
            FILTER_OP_EQUAL
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<NotificationRequest>>(
    () =>
      [
        {
          key: 'setting',
          label: t('views.notification.requests.form.setting'),
          icon: ['fa', 'cog'],
          width: '150',
          value: (row: NotificationRequest) => {
            if (row.test) {
              return (
                <ClTag
                  icon={['fa', 'bell']}
                  type="warning"
                  label={t('components.notification.request.test.label')}
                  tooltip={t('components.notification.request.test.tooltip')}
                />
              );
            }

            return (
              <ClNavLink
                path={`/notifications/settings/${row.setting_id}`}
                label={row.setting?.name}
              />
            );
          },
        },
        {
          key: 'channel',
          label: t('views.notification.requests.form.channel'),
          icon: ['fa', 'broadcast-tower'],
          width: '150',
          value: (row: NotificationRequest) => (
            <ClNavLink
              path={`/notifications/channels/${row.channel_id}`}
              label={row.channel?.name}
            />
          ),
        },
        {
          key: 'status',
          label: t('views.notification.requests.form.status'),
          icon: ['fa', 'check-square'],
          width: '150',
          value: (row: NotificationRequest) => (
            <ClNotificationRequestStatus
              status={row.status}
              error={row.error}
            />
          ),
        },
        {
          key: 'created_at',
          label: t('views.notification.requests.form.createdAt'),
          icon: ['fa', 'clock'],
          width: '150',
          value: (row: NotificationRequest) => <ClTime time={row.created_ts} />,
        },
        getPlaceholderColumn(),
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          className: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          icon: ['fa', 'tools'],
          width: '120',
          fixed: 'right',
          buttons: [
            {
              type: 'primary',
              size: 'small',
              icon: ['fa', 'search'],
              tooltip: t('common.actions.view'),
              onClick: (row: NotificationRequest) => {
                store.commit(`${ns}/setForm`, row);
              },
              action: ACTION_VIEW,
            },
          ],
        },
      ] as TableColumns<NotificationRequest>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<NotificationRequest>;

  setupListComponent(ns, store, ['notificationChannel', 'notificationSetting']);

  return {
    ...useList<NotificationRequest>(ns, store, opts),
  };
};

export default useNotificationRequestList;
