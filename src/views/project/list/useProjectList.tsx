import { computed, h } from 'vue';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants/table';
import { useStore } from 'vuex';
import useList from '@/layouts/content/list/useList';
import { useRouter } from 'vue-router';
import { translate } from '@/utils/i18n';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_VIEW,
  ACTION_VIEW_SPIDERS,
  FILTER_OP_CONTAINS,
} from '@/constants';
import { getIconByAction, onListFilterChangeByKey } from '@/utils';
import { ClNavLink } from '@/components';

const useProjectList = () => {
  // router
  const router = useRouter();

  // store
  const ns = 'project';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // i18n
  const t = translate;

  // use list
  const { actionFunctions } = useList<Project>(ns, store);

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
          label: t('views.projects.navActions.new.label'),
          tooltip: t('views.projects.navActions.new.tooltip'),
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
          placeholder: t('views.projects.navActions.filter.search.placeholder'),
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
  const tableColumns = computed<TableColumns<Project>>(
    () =>
      [
        {
          className: 'name',
          key: 'name',
          label: t('views.projects.table.columns.name'),
          icon: ['fa', 'font'],
          width: '150',
          value: (row: Project) => (
            <ClNavLink path={`/projects/${row._id}`} label={row.name} />
          ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          className: 'spiders',
          key: 'spiders',
          label: t('views.projects.table.columns.spiders'),
          icon: ['fa', 'spider'],
          value: (row: Project) => (
            <ClNavLink
              path={`/projects/${row._id}/spiders`}
              label={row.spiders || '0'}
            />
          ),
          width: '120',
        },
        {
          key: 'description',
          label: t('views.projects.table.columns.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '150',
          buttons: [
            {
              tooltip: t('common.actions.view'),
              onClick: async row => {
                await router.push(`/projects/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.viewSpiders'),
              onClick: async row => {
                await router.push(`/projects/${row._id}/spiders`);
              },
              action: ACTION_VIEW_SPIDERS,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.delete'),
              disabled: row => row.spiders > 0,
              onClick: deleteByIdConfirm,
              action: ACTION_DELETE,
              contextMenu: true,
            },
          ],
          disableTransfer: true,
        },
      ] as TableColumns<Project>
  );

  const selectableFunction = (row: Project) => {
    return row.spiders === 0;
  };

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Project>;

  return {
    ...useList<Project>(ns, store, opts),
    selectableFunction,
  };
};

export default useProjectList;
