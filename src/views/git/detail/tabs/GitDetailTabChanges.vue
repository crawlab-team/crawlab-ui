<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabChanges' });
import { computed, h, ref, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import GitFileStatus from '@/components/git/GitFileStatus.vue';
import Tag from '@/components/tag/Tag.vue';
import Table from '@/components/table/Table.vue';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { debounce, translate } from '@/utils';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants';

// i18n
const t = translate;

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId, currentBranch } = useGitDetail();

const getStatusTagProps = (change: GitChange): TagProps => {
  const { worktree, staging } = change;
  let label = staging;
  if ([' ', '?'].includes(staging || '')) {
    label = worktree;
  }
  switch (label) {
    case '?':
      return {
        type: 'danger',
        tooltip: t('components.git.changes.status.untracked'),
        label,
      };
    case 'M':
      return {
        type: 'primary',
        tooltip: t('components.git.changes.status.modified'),
        label,
      };
    case 'A':
      return {
        type: 'success',
        tooltip: t('components.git.changes.status.added'),
        label,
      };
    case 'D':
      return {
        type: 'info',
        tooltip: t('components.git.changes.status.deleted'),
        label,
      };
    case 'R':
      return {
        type: 'primary',
        tooltip: t('components.git.changes.status.renamed'),
        label,
      };
    case 'C':
      return {
        type: 'primary',
        tooltip: t('components.git.changes.status.copied'),
        label,
      };
    case 'U':
      return {
        type: 'danger',
        tooltip: t('components.git.changes.status.updatedButUnmerged'),
        label,
      };
    default:
      return { label };
  }
};

// table ref
const tableRef = ref<typeof Table>();

// table data
const tableData = computed<TableData<GitChange>>(() => state.gitChanges || []);

// table columns
const tableColumns = computed<TableColumns<GitChange>>(() => {
  return [
    {
      key: 'changed_file',
      label: t('components.git.changes.table.columns.changedFile'),
      icon: ['far', 'file-code'],
      value: (row: GitChange) => {
        return h(GitFileStatus, { fileStatus: row });
      },
    },
    {
      key: 'status',
      label: t('components.git.changes.table.columns.status'),
      width: '100',
      icon: ['fa', 'edit'],
      value: (row: GitChange) => {
        return h(Tag, getStatusTagProps(row));
      },
    },
    {
      key: TABLE_COLUMN_NAME_ACTIONS,
      className: TABLE_COLUMN_NAME_ACTIONS,
      label: t('components.table.columns.actions'),
      width: '150',
      icon: ['fa', 'tools'],
      fixed: 'right',
      buttons: [
        {
          type: 'info',
          size: 'small',
          icon: ['fa', 'plus'],
          tooltip: t('components.git.changes.table.actions.add'),
          disabled: (row: GitChange) => row.worktree !== '?',
          onClick: async (row: GitChange) => {
            try {
              await store.dispatch(`${ns}/addChanges`, {
                id: activeId.value,
                changes: [row],
              });
              await store.dispatch(`${ns}/getChanges`, { id: activeId.value });
            } catch (e: any) {
              ElMessage.error(e.message);
            }
          },
        },
        {
          type: 'info',
          size: 'small',
          icon: ['fa', 'undo'],
          tooltip: t('components.git.changes.table.actions.rollback'),
          onClick: async (row: GitChange) => {
            try {
              await store.dispatch(`${ns}/deleteChanges`, {
                id: activeId.value,
                changes: [row],
              });
              await store.dispatch(`${ns}/getChanges`, { id: activeId.value });
            } catch (e: any) {
              ElMessage.error(e.message);
            }
          },
        },
      ],
    },
  ] as TableColumns<GitChange>;
});

const onSelectionChange = (rows: TableData<GitChange>) => {
  store.commit(`${ns}/setGitChangeSelection`, rows);
};

watch(
  () => tableData.value,
  () => tableRef.value?.clearSelection()
);

const loading = ref(false);
const getChanges = debounce(async () => {
  if (!activeId.value) return;
  loading.value = true;
  try {
    await store.dispatch(`${ns}/getChanges`, { id: activeId.value });
  } finally {
    loading.value = false;
  }
});
watch(currentBranch, getChanges);
watch(activeId, getChanges);
onBeforeMount(getChanges);
</script>

<template>
  <div class="git-changes">
    <cl-table
      v-loading="loading"
      ref="tableRef"
      :data="tableData"
      :columns="tableColumns"
      :row-key="
        ({ path, worktree, staging }: GitChange) =>
          [path, worktree, staging].join('_')
      "
      height="100%"
      hide-footer
      :border="false"
      fit
      selectable
      :empty-text="t('components.git.changes.table.empty')"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<style scoped lang="scss">
.git-changes {
  height: 100%;

  .table {
    height: 100%;
  }
}
</style>

<style scoped>
.git-changes:deep(.el-table) {
  border-top: none;
  border-left: none;
  border-right: none;
}

.git-changes:deep(.file-name.deleted) {
  text-decoration: line-through;
}
</style>
