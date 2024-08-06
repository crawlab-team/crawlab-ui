import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  FILTER_OP_CONTAINS,
} from '@/constants';
import { onListFilterChangeByKey, translate } from '@/utils';
import useRequest from '@/services/request';
import useList from '@/layouts/content/list/useList';
import NavLink from '@/components/ui/nav/NavLink.vue';
import ClTag from '@/components/ui/tag/Tag.vue';
import useNotificationChannel from '@/components/core/notification/channel/useNotificationChannel';

const t = translate;

const { post } = useRequest();

const useNotificationChannelList = () => {
  // router
  const router = useRouter();

  // store
  const ns: ListStoreNamespace = 'notificationChannel';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // use list
  const { actionFunctions } = useList<NotificationChannel>(ns, store);

  // action functions
  const { deleteByIdConfirm } = actionFunctions;

  const { getProviderIcon } = useNotificationChannel(store);

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
          label: t('views.notification.channels.navActions.new.label'),
          tooltip: t('views.notification.channels.navActions.new.tooltip'),
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
            'views.notification.channels.navActions.filter.search.placeholder'
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
  const tableColumns = computed<TableColumns<NotificationChannel>>(
    () =>
      [
        {
          key: 'name',
          label: t('views.notification.channels.form.name'),
          icon: ['fa', 'font'],
          width: '240',
          value: (row: NotificationChannel) => (
            <NavLink
              label={row.name}
              path={`/notifications/channels/${row._id}`}
            />
          ),
        },
        {
          key: 'type',
          label: t('views.notification.channels.form.type'),
          icon: ['fa', 'list'],
          width: '150',
          value: (row: NotificationChannel) => {
            let icon: Icon;
            let type: BasicType;
            switch (row.type) {
              case 'mail':
                icon = ['fa', 'at'];
                type = 'primary';
                break;
              case 'im':
                icon = ['fa', 'comment'];
                type = 'success';
                break;
              default:
                return null;
            }
            return (
              <ClTag
                type={type}
                label={t(`views.notification.channels.types.${row.type}`)}
                icon={icon}
              />
            );
          },
        },
        {
          key: 'provider',
          label: t('views.notification.channels.form.provider'),
          icon: ['fa', 'industry'],
          width: '200',
          value: (row: NotificationChannel) => {
            return (
              <ClTag
                type="info"
                label={t(
                  `views.notification.channels.providers.${row.provider}`
                )}
                icon={getProviderIcon(row.provider as string)}
              />
            );
          },
        },
        {
          key: 'description',
          label: t('views.notification.channels.form.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
        },
        {
          key: 'actions',
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '200',
          buttons: [
            {
              type: 'primary',
              icon: ['fa', 'search'],
              tooltip: t('common.actions.view'),
              onClick: async (row: NotificationChannel) => {
                await router.push(`/notifications/channels/${row._id}`);
              },
            },
            {
              type: 'danger',
              size: 'small',
              icon: ['fa', 'trash-alt'],
              tooltip: t('common.actions.delete'),
              onClick: deleteByIdConfirm,
              className: 'delete-btn',
              action: ACTION_DELETE,
            },
          ],
          disableTransfer: true,
        },
      ] as TableColumns<NotificationChannel>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<NotificationChannel>;

  return {
    ...useList<NotificationChannel>(ns, store, opts),
  };
};

export default useNotificationChannelList;
