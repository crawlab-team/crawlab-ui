import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_VIEW,
  ACTION_VIEW_CHANNELS,
  ACTION_VIEW_MAIL,
  ACTION_VIEW_TEMPLATE,
  FILTER_OP_CONTAINS,
} from '@/constants';
import { onListFilterChangeByKey, translate } from '@/utils';
import useRequest from '@/services/request';
import useList from '@/layouts/content/list/useList';
import NavLink from '@/components/ui/nav/NavLink.vue';
import Switch from '@/components/ui/switch/Switch.vue';

const t = translate;

const { post } = useRequest();

const useNotificationSettingList = () => {
  // router
  const router = useRouter();

  // store
  const ns: ListStoreNamespace = 'notificationSetting';
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
          label: t('views.notification.settings.navActions.new.label'),
          tooltip: t('views.notification.settings.navActions.new.tooltip'),
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
            'views.notification.settings.navActions.filter.search.placeholder'
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
  const tableColumns = computed<TableColumns<NotificationSetting>>(
    () =>
      [
        {
          key: 'name',
          label: t('views.notification.settings.form.name'),
          icon: ['fa', 'font'],
          width: '240',
          value: (row: NotificationSetting) => (
            <NavLink
              label={row.name}
              path={`/notifications/settings/${row._id}`}
            />
          ),
        },
        {
          key: 'enabled',
          label: t('views.notification.settings.form.enabled'),
          icon: ['fa', 'toggle-on'],
          width: '120',
          value: (row: NotificationSetting) => (
            <Switch
              modelValue={row.enabled}
              onChange={async (value: boolean) => {
                if (!row._id) return;
                if (!value) {
                  await post(`/notifications/settings/${row._id}/disable`);
                  ElMessage.success(t('common.message.success.disabled'));
                } else {
                  await post(`/notifications/settings/${row._id}/enable`);
                  ElMessage.success(t('common.message.success.enabled'));
                }
              }}
            />
          ),
        },
        {
          key: 'description',
          label: t('views.notification.settings.form.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
        },
        {
          key: 'actions',
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '120',
          buttons: [
            {
              type: 'primary',
              tooltip: t('common.actions.view'),
              onClick: async (row: NotificationSetting) => {
                await router.push(`/notifications/settings/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.viewMail'),
              onClick: async (row: NotificationSetting) => {
                await router.push(`/notifications/settings/${row._id}/mail`);
              },
              action: ACTION_VIEW_MAIL,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewTemplate'),
              onClick: async (row: NotificationSetting) => {
                await router.push(
                  `/notifications/settings/${row._id}/template`
                );
              },
              action: ACTION_VIEW_TEMPLATE,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewChannels'),
              onClick: async (row: NotificationSetting) => {
                await router.push(
                  `/notifications/settings/${row._id}/channels`
                );
              },
              action: ACTION_VIEW_CHANNELS,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.delete'),
              onClick: deleteByIdConfirm,
              className: 'delete-btn',
              action: ACTION_DELETE,
              contextMenu: true,
            },
          ],
          disableTransfer: true,
        },
      ] as TableColumns<NotificationSetting>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<NotificationSetting>;

  return {
    ...useList<NotificationSetting>(ns, store, opts),
  };
};

export default useNotificationSettingList;
