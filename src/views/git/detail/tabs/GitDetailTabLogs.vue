<script setup lang="ts">
import { computed, h, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { Column } from 'element-plus';
import { debounce } from '@/utils';
import { GIT_REF_TYPE_BRANCH } from '@/constants/git';
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

// all table data
const allTableData = computed<TableData<GitRef>>(() => state.gitLogs || []);

// table data
const tableData = computed<TableData<GitLog>>(() => {
  return allTableData.value.sort((a: GitRef, b: GitRef) =>
    (b.timestamp || '') > (a.timestamp || '') ? 1 : -1
  );
});

// table columns
const tableColumns = computed<Column<GitLog>[]>(() => {
  return [
    {
      title: t('components.git.logs.table.columns.reference'),
      width: 120,
      cellRenderer: ({ rowData }: { rowData: GitLog }) => {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
            },
          },
          rowData.refs?.map(r =>
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
          )
        );
      },
    },
    {
      dataKey: 'msg',
      width: 300,
      flexGrow: 1,
      title: t('components.git.logs.table.columns.commitMessage'),
    },
    {
      title: t('components.git.logs.table.columns.author'),
      width: 120,
      cellRenderer: ({ rowData }: { rowData: GitLog }) => {
        const { author_name, author_email } = rowData;
        return `${author_name}${author_email ? ' (' + author_email + ')' : ''}`;
      },
    },
    {
      title: t('components.git.logs.table.columns.timestamp'),
      width: 200,
      fixed: 'right',
      cellRenderer: ({ rowData }: { rowData: GitLog }) => {
        return h(Time, {
          time: rowData.timestamp,
          ago: false,
          format: 'YYYY-MM-DD hh:mm:ss A',
        });
      },
    },
  ] as Column<GitLog>[];
});

const loading = ref(false);
const getLogs = debounce(async () => {
  loading.value = true;
  try {
    await store.dispatch(`${ns}/getLogs`, { id: activeId.value });
  } finally {
    loading.value = false;
  }
});
watch(activeId, () => {
  store.commit(`${ns}/resetGitLogs`);
  getLogs();
});
onBeforeMount(getLogs);
defineOptions({ name: 'ClGitDetailTabLogs' });
</script>

<template>
  <div v-loading="loading" class="git-logs">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :data="tableData"
          :columns="tableColumns"
          :row-key="
            ({ hash, timestamp }: GitRef) => [hash, timestamp].join('_')
          "
          :total="allTableData.length"
          :border="false"
          :width="width"
          :height="height"
        />
      </template>
    </el-auto-resizer>
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

.git-logs:deep(.el-tag) {
  transition: none;
}
</style>
