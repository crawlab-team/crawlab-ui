<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabChanges' });
import { computed, h, ref, watch, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import GitFileStatus from '@/components/git/GitFileStatus.vue';
import Tag, { TagProps } from '@/components/tag/Tag.vue';
import Table from '@/components/table/Table.vue';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { debounce, translate } from '@/utils';

// i18n
const t = translate;

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId, currentBranch } = useGitDetail();

const getStatusTagProps = (status?: string): TagProps => {
  const label = status;
  switch (status) {
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
      fixed: 'right',
      value: (row: GitChange) => {
        return h(Tag, getStatusTagProps(row.worktree));
      },
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
onMounted(() => {
  if (state.gitChangesDefaultCheckAll) {
    tableRef.value?.checkAll();
  }
});
</script>

<template>
  <div class="git-changes">
    <cl-table
      v-loading="loading"
      ref="tableRef"
      :data="tableData"
      :columns="tableColumns"
      height="100%"
      hide-footer
      :border="false"
      fit
      selectable
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
</style>
