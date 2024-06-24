<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabLogs' });
import { computed, h, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { debounce } from '@/utils';
import { GIT_REF_TYPE_BRANCH } from '@/constants/git';
import { TABLE_ACTION_CUSTOMIZE_COLUMNS } from '@/constants/table';
import Time from '@/components/time/Time.vue';
import Tag from '@/components/tag/Tag.vue';
import useGitDetail from '@/views/git/detail/useGitDetail';

// i18n
const { t } = useI18n();

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId } = useGitDetail();

// table pagination
const tablePagination = ref<TablePagination>({
  page: 1,
  size: 10,
});

const onPaginationChange = (pagination: TablePagination) => {
  tablePagination.value = { ...pagination };
};

// all table data
const allTableData = computed<TableData<GitRef>>(() => state.gitLogs || []);

// table data
const tableData = computed<TableData<GitLog>>(() => {
  const { page, size } = tablePagination.value;
  return allTableData.value.filter(
    (_, i) => i >= (page - 1) * size && i < page * size
  );
});

// table columns
const tableColumns = computed<TableColumns<GitLog>>(() => {
  return [
    {
      key: 'ref',
      label: t('components.git.logs.table.columns.reference'),
      width: '120',
      icon: ['fa', 'tags'],
      value: (row: GitLog) => {
        return row.refs?.map(r =>
          h(Tag, {
            label: r.name,
            icon:
              r.type === GIT_REF_TYPE_BRANCH
                ? ['fa', 'code-branch']
                : ['fa', 'tag'],
            effect: r.type === GIT_REF_TYPE_BRANCH ? 'dark' : 'light',
            type: r.type === GIT_REF_TYPE_BRANCH ? 'primary' : 'success',
            tooltip: `${r.type}: ${r.name}`,
          })
        );
      },
    },
    {
      key: 'msg',
      label: t('components.git.logs.table.columns.commitMessage'),
      icon: ['fa', 'comment-alt'],
    },
    {
      key: 'author',
      label: t('components.git.logs.table.columns.author'),
      width: '250',
      icon: ['fa', 'user'],
      value: (row: GitLog) => {
        return `${row.author_name}${row.author_email ? ' (' + row.author_email + ')' : ''}`;
      },
    },
    {
      key: 'timestamp',
      label: t('components.git.logs.table.columns.timestamp'),
      width: '200',
      icon: ['fa', 'clock'],
      fixed: 'right',
      value: (row: GitLog) => {
        return h(Time, {
          time: row.timestamp,
          ago: false,
          format: 'YYYY-MM-DD hh:mm:ss A',
        });
      },
    },
  ] as TableColumns<GitLog>;
});

const getLogs = debounce(() => {
  store.dispatch(`${ns}/getLogs`, { id: activeId.value });
});
watch(activeId, () => {
  store.commit(`${ns}/resetGitLogs`);
  getLogs();
});
onBeforeMount(getLogs);
</script>

<template>
  <div class="git-logs">
    <cl-table
      :data="tableData"
      :columns="tableColumns"
      row-key="hash"
      :page="tablePagination.page"
      :page-size="tablePagination.size"
      :total="allTableData.length"
      :visible-buttons="[TABLE_ACTION_CUSTOMIZE_COLUMNS]"
      :border="false"
      fit
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<style scoped lang="scss">
.git-logs {
  height: 100%;

  .table {
    height: 100%;
  }
}
</style>

<style scoped>
.git-logs:deep(.el-table) {
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
