import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants/table';
import useList from '@/layouts/content/list/useList';
import NavLink from '@/components/ui/nav/NavLink.vue';
import UserRole from '@/components/core/user/UserRole.vue';
import { USERNAME_ADMIN } from '@/constants/user';
import { translate } from '@/utils/i18n';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_VIEW,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
} from '@/constants';
import { getIconByAction, onListFilterChangeByKey } from '@/utils';
import useUser from '@/components/core/user/useUser';
import { ClNavLink } from '@/components';
import { getUserFullName } from '@/utils/user';

// i18n
const t = translate;

const useUserList = () => {
  // router
  const router = useRouter();

  // store
  const ns = 'user';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // use list
  const { actionFunctions } = useList<User>(ns, store);

  const { rolesOptions } = useUser(store);

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
          label: t('views.users.navActions.new.label'),
          tooltip: t('views.users.navActions.new.tooltip'),
          icon: getIconByAction(ACTION_ADD),
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
          placeholder: t('views.users.navActions.filter.search.placeholder'),
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'name',
            FILTER_OP_CONTAINS
          ),
        },
        {
          action: ACTION_FILTER_SEARCH,
          id: 'filter-search-email',
          className: 'search-email',
          placeholder: t(
            'views.users.navActionsExtra.filter.search.email.placeholder'
          ),
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'email',
            FILTER_OP_CONTAINS
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-priority',
          className: 'filter-select-priority',
          label: t('views.users.navActionsExtra.filter.select.role.label'),
          options: rolesOptions,
          onChange: onListFilterChangeByKey(store, ns, 'role', FILTER_OP_EQUAL),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<User>>(() =>
    [
      {
        key: 'username',
        label: t('views.users.table.columns.username'),
        icon: ['fa', 'font'],
        width: '180',
        value: (row: User) => (
          <ClNavLink
            path={`/users/${row._id}`}
            label={row.username}
            icon={row.root_admin ? ['fa', 'shield-alt'] : ['fa', 'user']}
          />
        ),
        hasSort: true,
        hasFilter: true,
        allowFilterSearch: true,
      },
      {
        key: 'full_name',
        label: t('views.users.table.columns.fullName'),
        icon: ['fa', 'font'],
        width: '180',
        value: (row: User) => (
          <ClNavLink path={`/users/${row._id}`} label={getUserFullName(row)} />
        ),
      },
      {
        key: 'email',
        label: t('views.users.table.columns.email'),
        icon: ['fa', 'at'],
        width: '180',
        value: (row: User) => (
          <ClNavLink path={`/users/${row._id}`} label={row.email} />
        ),
      },
      {
        key: 'role',
        label: t('views.users.table.columns.role'),
        icon: ['fa', 'user-tag'],
        width: '150',
        value: (row: User) => (
          <ClNavLink
            path={`/roles/${row.role_id}`}
            label={row.root_admin_role ? t('common.builtin.admin') : row.role}
            icon={row.root_admin_role ? ['fa', 'shield-alt'] : ['fa', 'user']}
          />
        ),
        hasFilter: true,
        allowFilterItems: true,
        filterItems: rolesOptions,
      },
      {
        key: 'placeholder',
        width: 'auto',
      },
      {
        key: TABLE_COLUMN_NAME_ACTIONS,
        label: t('components.table.columns.actions'),
        fixed: 'right',
        width: '150',
        buttons: [
          {
            tooltip: t('common.actions.view'),
            onClick: async (row: User) => {
              await router.push(`/users/${row._id}`);
            },
            action: ACTION_VIEW,
          },
          {
            tooltip: t('common.actions.delete'),
            disabled: (row: User) => row.root_admin,
            onClick: deleteByIdConfirm,
            action: ACTION_DELETE,
            contextMenu: true,
          },
        ],
        disableTransfer: true,
      },
    ].map(col => col as TableColumn<User>)
  );

  const selectableFunction = (row: User) => {
    return !row.root_admin;
  };

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<User>;

  return {
    ...useList<User>(ns, store, opts),
    selectableFunction,
  };
};

export default useUserList;
