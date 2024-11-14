import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_VIEW,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import {
  onListFilterChangeByKey,
  setupListComponent,
  translate,
} from '@/utils';
import useList from '@/layouts/content/list/useList';
import NavLink from '@/components/ui/nav/NavLink.vue';
import { ClSwitch } from '@/components';
import { ElMessage } from 'element-plus';

const t = translate;

const useNotificationAlertList = () => {
  const router = useRouter();

  // store
  const ns: ListStoreNamespace = 'notificationAlert';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // use list
  const { actionFunctions } = useList<NotificationSetting>(ns, store);

  // action functions
  const { deleteByIdConfirm } = actionFunctions;

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      name: 'common',
      children: [
        {
          action: ACTION_ADD,
          id: 'add-btn',
          className: 'add-btn',
          buttonType: 'label',
          label: t('views.notification.alerts.navActions.new.label'),
          tooltip: t('views.notification.alerts.navActions.new.tooltip'),
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
          placeholder: t(
            'views.notification.alerts.navActions.filter.search.placeholder'
          ),
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'name',
            FILTER_OP_CONTAINS
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<NotificationAlert>>(
    () =>
      [
        {
          key: 'name',
          label: t('views.notification.alerts.form.name'),
          icon: ['fa', 'font'],
          width: '240',
          value: (row: NotificationAlert) => (
            <NavLink
              path={`/notifications/alerts/${row._id}`}
              label={row.name}
            />
          ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: 'enabled',
          label: t('views.notification.alerts.form.enabled'),
          icon: ['fa', 'toggle-on'],
          width: '120',
          value: (row: NotificationAlert) => (
            <ClSwitch
              modelValue={row.enabled}
              onChange={async (enabled: boolean) => {
                await store.dispatch(`${ns}/updateById`, {
                  id: row._id,
                  form: {
                    ...row,
                    enabled,
                  },
                });
                if (enabled) {
                  ElMessage.success(t('common.message.success.enabled'));
                } else {
                  ElMessage.success(t('common.message.success.disabled'));
                }
              }}
            />
          ),
        },
        {
          key: 'description',
          label: t('views.schedules.table.columns.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          className: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          icon: ['fa', 'tools'],
          width: '120',
          fixed: 'right',
          buttons: [
            {
              tooltip: t('common.actions.view'),
              onClick: async (row: NotificationAlert) => {
                await router.push(`/notifications/alerts/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.delete'),
              onClick: deleteByIdConfirm,
              className: 'delete-btn',
              action: ACTION_DELETE,
              contextMenu: true,
            },
          ],
        },
      ] as TableColumns<NotificationAlert>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<NotificationAlert>;

  setupListComponent(ns, store, ['node']);

  return {
    ...useList<NotificationAlert>(ns, store, opts),
  };
};

export default useNotificationAlertList;
