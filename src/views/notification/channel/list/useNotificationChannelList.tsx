import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_SEND_TEST_MESSAGE,
  ACTION_VIEW,
  FILTER_OP_CONTAINS,
} from '@/constants';
import { onListFilterChangeByKey, translate } from '@/utils';
import useList from '@/layouts/content/list/useList';
import { ClTag, ClNavLink, useNotificationChannel } from '@/components';

const t = translate;

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

  const btnLoadingMap = ref(new Map<string, boolean>());

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
            <ClNavLink
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
          width: '150',
          buttons: [
            {
              tooltip: t('common.actions.view'),
              onClick: async (row: NotificationChannel) => {
                await router.push(`/notifications/channels/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.sendTestMessage'),
              loading: (row: NotificationChannel) =>
                btnLoadingMap.value.get(
                  `${row._id}:${ACTION_SEND_TEST_MESSAGE}`
                ) || false,
              onClick: async (row: NotificationChannel) => {
                let toMail: string | undefined = undefined;
                if (row.type === 'mail') {
                  const res = await ElMessageBox.prompt(
                    t(
                      'views.notification.messageBox.prompt.sendTestMessage.title'
                    ),
                    t('common.actions.sendTestMessage'),
                    {
                      inputPlaceholder: t(
                        'views.notification.messageBox.prompt.sendTestMessage.placeholder'
                      ),
                      inputPattern: /\S+@\S+\.\S+/,
                      confirmButtonText: t('common.actions.confirm'),
                      cancelButtonText: t('common.actions.cancel'),
                      type: 'warning',
                    }
                  );
                  toMail = res.value;
                } else {
                  await ElMessageBox.confirm(
                    t('views.notification.messageBox.confirm.sendTestMessage'),
                    t('common.actions.sendTestMessage'),
                    {
                      confirmButtonText: t('common.actions.confirm'),
                      cancelButtonText: t('common.actions.cancel'),
                      type: 'warning',
                    }
                  );
                }
                btnLoadingMap.value.set(
                  `${row._id}:${ACTION_SEND_TEST_MESSAGE}`,
                  true
                );
                try {
                  await store.dispatch(`${ns}/sendTestMessage`, {
                    id: row._id,
                    toMail,
                  });
                  ElMessage.success(
                    t('views.notification.message.success.sendTestMessage')
                  );
                } catch (e: any) {
                  ElMessage.error(e.message);
                } finally {
                  btnLoadingMap.value.set(
                    `${row._id}:${ACTION_SEND_TEST_MESSAGE}`,
                    false
                  );
                }
              },
              action: ACTION_SEND_TEST_MESSAGE,
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
