import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants/table';
import useList from '@/layouts/content/list/useList';
import { translate } from '@/utils/i18n';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_VIEW,
  ACTION_VIEW_PAGES,
  ACTION_VIEW_USERS,
  FILTER_OP_CONTAINS,
} from '@/constants';
import { getIconByAction, onListFilterChangeByKey } from '@/utils';
import { ClNavLink } from '@/components';
import { ROLE_KEY_ADMIN } from '@/constants/role';

// i18n
const t = translate;

const useRoleList = () => {
  // router
  const router = useRouter();

  // store
  const ns = 'role';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // use list
  const { actionFunctions } = useList<Role>(ns, store);

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
          label: t('views.roles.navActions.new.label'),
          tooltip: t('views.roles.navActions.new.tooltip'),
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
          placeholder: t('views.roles.navActions.filter.search.placeholder'),
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
  const tableColumns = computed<TableColumns<Role>>(
    () =>
      [
        {
          key: 'name',
          label: t('views.roles.table.columns.name'),
          icon: ['fa', 'font'],
          width: '180',
          value: (row: Role) => (
            <ClNavLink
              path={`/roles/${row._id}`}
              label={row.root_admin ? t('common.builtin.admin') : row.name}
              icon={row.root_admin ? ['fa', 'shield-alt'] : ['fa', 'user']}
            />
          ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          className: 'pages',
          key: 'routes',
          label: t('views.roles.table.columns.pages'),
          icon: ['fa', 'file-alt'],
          value: (row: Role) => (
            <ClNavLink
              path={`/roles/${row._id}/pages`}
              label={
                row.root_admin
                  ? t('common.mode.all')
                  : row.routes?.length || '0'
              }
            />
          ),
          width: '120',
        },
        {
          className: 'users',
          key: 'users',
          label: t('views.roles.table.columns.users'),
          icon: ['fa', 'users'],
          value: (row: Role) => (
            <ClNavLink
              path={`/roles/${row._id}/users`}
              label={row.users || '0'}
            />
          ),
          width: '120',
        },
        {
          key: 'description',
          label: t('views.roles.table.columns.description'),
          icon: ['fa', 'font'],
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
              onClick: async (row: Role) => {
                await router.push(`/roles/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.viewPages'),
              onClick: async (row: Role) => {
                await router.push(`/roles/${row._id}/pages`);
              },
              action: ACTION_VIEW_PAGES,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewUsers'),
              onClick: async (row: Role) => {
                await router.push(`/roles/${row._id}/users`);
              },
              action: ACTION_VIEW_USERS,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.delete'),
              disabled: (row: Role) => row.root_admin,
              onClick: deleteByIdConfirm,
              action: ACTION_DELETE,
              contextMenu: true,
            },
          ],
          disableTransfer: true,
        },
      ] as TableColumns<Role>
  );

  const selectableFunction = (row: Role) => {
    return !row.root_admin;
  };

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Role>;

  return {
    ...useList<Role>(ns, store, opts),
    selectableFunction,
  };
};

export default useRoleList;
