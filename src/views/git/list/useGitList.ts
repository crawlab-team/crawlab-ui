import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_VIEW,
  FILTER_OP_CONTAINS,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import { useList } from '@/layouts/content';
import {
  onListFilterChangeByKey,
  setupListComponent,
  translate,
} from '@/utils';
import useGit from '@/components/core/git/useGit';
import NavLink from '@/components/ui/nav/NavLink.vue';
import GitStatus from '@/components/core/git/GitStatus.vue';
import ClTag from '@/components/ui/tag/Tag.vue';
import ClIcon from '@/components/ui/icon/Icon.vue';

const useGitList = () => {
  // router
  const router = useRouter();

  // store
  const ns = 'git';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // i18n
  const t = translate;

  // use list
  const { actionFunctions } = useList<Git>(ns, store);

  // action functions
  const { deleteByIdConfirm } = actionFunctions;

  const { getGitIcon } = useGit(store);

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
          label: t('views.gits.navActions.new.label'),
          tooltip: t('views.gits.navActions.new.tooltip'),
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
          placeholder: t('views.gits.navActions.filter.search.placeholder'),
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
  const tableColumns = computed<TableColumns<Git>>(
    () =>
      [
        {
          className: 'name',
          key: 'name',
          label: t('views.gits.table.columns.name'),
          icon: ['fa', 'font'],
          width: '240',
          value: (row: Git) =>
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  gap: '8px',
                },
              },
              [
                h(ClIcon, {
                  icon: getGitIcon(row).icon,
                  color: getGitIcon(row).color,
                }),
                h(NavLink, {
                  path: `/gits/${row._id}`,
                  label: row.name,
                }),
              ]
            ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          className: 'status',
          key: 'status',
          label: t('views.gits.table.columns.status'),
          icon: ['fa', 'heartbeat'],
          width: '160',
          value: (row: Git) => {
            const { _id, status, error, clone_logs } = row;
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                },
              },
              [
                h(GitStatus, {
                  id: _id,
                  status,
                  error,
                  onClick: () => {
                    router.push(`/gits/${_id}`);
                  },
                  onRetry: () => store.dispatch(`${ns}/getList`),
                }),
                clone_logs?.length
                  ? h(ClTag, {
                      type: 'info',
                      icon: ['fa', 'file-alt'],
                      tooltip: t('components.git.form.cloneLogs'),
                      clickable: true,
                      onClick: () => {
                        store.commit(`${ns}/showDialog`, 'logs');
                        store.commit(`${ns}/setForm`, row);
                      },
                    })
                  : null,
              ]
            );
          },
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          className: 'spiders',
          key: 'spiders',
          label: t('views.gits.table.columns.spiders'),
          icon: ['fa', 'spider'],
          width: '120',
          value: (row: Git) =>
            h(NavLink, {
              path: `/gits/${row._id}/spiders`,
              label: row.spiders?.length || 0,
            }),
          hasSort: false,
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '200',
          buttons: [
            {
              className: 'view-btn',
              type: 'primary',
              icon: ['fa', 'search'],
              tooltip: t('common.actions.view'),
              onClick: async (row: Git) => {
                await router.push(`/gits/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              className: 'delete-btn',
              type: 'danger',
              size: 'small',
              icon: ['fa', 'trash-alt'],
              tooltip: row =>
                !row.spiders?.length
                  ? t('common.actions.delete')
                  : t('views.gits.table.actions.tooltip.deleteNotAllowed'),
              disabled: row => row.spiders?.length > 0,
              onClick: deleteByIdConfirm,
              action: ACTION_DELETE,
            },
          ],
          disableTransfer: true,
        },
      ] as TableColumns<Git>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Git>;

  // init
  setupListComponent(ns, store, []);

  return {
    ...useList<Git>(ns, store, opts),
  };
};

export default useGitList;
