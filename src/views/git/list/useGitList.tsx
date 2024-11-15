import { computed, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_VIEW,
  ACTION_VIEW_CHANGES,
  ACTION_VIEW_COMMITS,
  ACTION_VIEW_FILES,
  ACTION_VIEW_SPIDERS,
  FILTER_OP_CONTAINS,
  GIT_STATUS_ERROR,
  TABLE_COLUMN_NAME_ACTIONS,
} from '@/constants';
import { useList } from '@/layouts';
import {
  getPlaceholderColumn,
  onListFilterChangeByKey,
  setupListComponent,
  translate,
} from '@/utils';
import { useGit } from '@/components';
import { ClNavLink, ClGitStatus, ClTag, ClIcon } from '@/components';
import { ElMessage } from 'element-plus';

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
          value: (row: Git) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                gap: '8px',
              }}
            >
              <ClIcon
                icon={getGitIcon(row).icon}
                color={getGitIcon(row).color}
              />
              <ClNavLink path={`/gits/${row._id}`} label={row.name} />
            </div>
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
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                }}
              >
                <ClGitStatus
                  id={_id}
                  status={status}
                  error={error}
                  onViewLogs={async () => {
                    store.commit(`${ns}/showDialog`, 'logs');
                    store.commit(`${ns}/setForm`, row);
                  }}
                  onRetry={async () => {
                    try {
                      await store.dispatch(`${ns}/cloneGit`, { id: row._id });
                      ElMessage.info(t('common.message.info.retry'));
                      await store.dispatch(`${ns}/getList`);
                    } catch (e: any) {
                      ElMessage.error(e.message);
                    }
                  }}
                />
              </div>
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
          value: (row: Git) => (
            <ClNavLink
              path={`/gits/${row._id}/spiders`}
              label={row.spiders?.length || '0'}
            />
          ),
          hasSort: false,
        },
        getPlaceholderColumn(),
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '200',
          buttons: [
            {
              tooltip: t('common.actions.view'),
              onClick: async (row: Git) => {
                await router.push(`/gits/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.viewFiles'),
              onClick: async (row: Git) => {
                await router.push(`/gits/${row._id}/files`);
              },
              action: ACTION_VIEW_FILES,
            },
            {
              tooltip: t('common.actions.viewChanges'),
              onClick: async (row: Git) => {
                await router.push(`/gits/${row._id}/changes`);
              },
              action: ACTION_VIEW_CHANGES,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewCommits'),
              onClick: async (row: Git) => {
                await router.push(`/gits/${row._id}/commits`);
              },
              action: ACTION_VIEW_COMMITS,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewSpiders'),
              onClick: async (row: Git) => {
                await router.push(`/gits/${row._id}/spiders`);
              },
              action: ACTION_VIEW_SPIDERS,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.delete'),
              disabled: row => row.spiders?.length > 0,
              onClick: deleteByIdConfirm,
              action: ACTION_DELETE,
              contextMenu: true,
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

  const selectableFunction: TableSelectableFunction<Git> = (row: Git) => {
    return !row.spiders?.length;
  };

  const rowKeyFunction: TableRowKeyFunction<Git> = ({
    _id,
    name,
    status,
    spiders,
  }: Git) => [_id, name, status, JSON.stringify(spiders)].join('_');

  return {
    ...useList<Git>(ns, store, opts),
    selectableFunction,
    rowKeyFunction,
  };
};

export default useGitList;
