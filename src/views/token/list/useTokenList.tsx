import useList from '@/layouts/content/list/useList';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants/table';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import { translate } from '@/utils/i18n';
import {
  ACTION_ADD,
  ACTION_COPY,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_VIEW,
  FILTER_OP_CONTAINS,
} from '@/constants';
import { getIconByAction, onListFilterChangeByKey } from '@/utils';

// i18n
const t = translate;

const useTokenList = () => {
  const ns = 'token';
  const store = useStore<RootStoreState>();

  // use list
  const { actionFunctions } = useList<Token>(ns, store);

  // action functions
  const { deleteByIdConfirm } = actionFunctions;

  // clipboard
  const { toClipboard } = useClipboard();

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
          label: t('views.tokens.navActions.new.label'),
          tooltip: t('views.tokens.navActions.new.tooltip'),
          icon: getIconByAction(ACTION_ADD),
          type: 'success',
          onClick: async () => {
            const res = await ElMessageBox.prompt(
              t('views.tokens.messageBox.prompt.create.title'),
              t('common.actions.create'),
              {
                inputPlaceholder: t(
                  'views.tokens.messageBox.prompt.create.placeholder'
                ),
              }
            );
            const name = res.value || `PAT-${new Date().toISOString()}`;
            const token = {
              name,
            } as Token;
            await store.dispatch(`${ns}/create`, token);
            await store.dispatch(`${ns}/getList`);
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
          placeholder: t('views.tokens.navActions.filter.search.placeholder'),
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
  const tableColumns = computed<TableColumns<Token>>(() =>
    [
      {
        key: 'name',
        label: t('views.tokens.table.columns.name'),
        icon: ['fa', 'font'],
        width: '160',
        hasFilter: true,
        allowFilterSearch: true,
      },
      {
        key: 'token',
        label: t('views.tokens.table.columns.token'),
        icon: ['fa', 'key'],
        width: 'auto',
        value: (row: Token) => {
          if (!row._visible) {
            return (() => {
              const arr = [] as string[];
              for (let i = 0; i < 100; i++) {
                arr.push('*');
              }
              return arr.join('');
            })();
          } else {
            return row.token;
          }
        },
      },
      {
        key: TABLE_COLUMN_NAME_ACTIONS,
        label: t('components.table.columns.actions'),
        icon: ['fa', 'tools'],
        width: '180',
        fixed: 'right',
        buttons: (row: Token) => [
          {
            icon: !row._visible ? ['fa', 'eye'] : ['fa', 'eye-slash'],
            tooltip: !row._visible
              ? t('common.actions.view')
              : t('common.actions.hide'),
            onClick: async (row: Token) => {
              row._visible = !row._visible;
            },
            action: ACTION_VIEW,
          },
          {
            icon: ['far', 'clipboard'],
            tooltip: t('common.actions.copy'),
            onClick: async (row: Token) => {
              if (!row.token) return;
              await toClipboard(row.token);
              ElMessage.success(t('common.message.success.copy'));
            },
            action: ACTION_COPY,
          },
          {
            tooltip: t('common.actions.delete'),
            onClick: deleteByIdConfirm,
            action: ACTION_DELETE,
            contextMenu: true,
          },
        ],
        disableTransfer: true,
      },
    ].map(col => col as TableColumn<Token>)
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Token>;

  return {
    ...useList<Token>(ns, store, opts),
  };
};

export default useTokenList;
