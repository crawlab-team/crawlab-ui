<script setup lang="ts">
import {computed, h, onBeforeMount, ref} from 'vue';
import {useStore} from 'vuex';
import Time from '@/components/time/Time.vue';
import {GIT_REF_TYPE_BRANCH} from '@/constants/git';
import {TABLE_ACTION_CUSTOMIZE_COLUMNS} from '@/constants/table';
import {useI18n} from 'vue-i18n';
import useGitDetail from "@/views/git/detail/useGitDetail";
import {plainClone} from "@/utils";

// i18n
const {t} = useI18n();

// store
const ns = 'git';
const store = useStore();
const {
  git: state,
} = store.state as RootStoreState;

const {
  activeId,
} = useGitDetail();

// git logs map
const gitLogsMap = computed<Map<string, GitLog>>(() => store.getters[`${ns}/gitLogsMap`] as Map<string, GitLog>);

// git ref type
const gitRefType = computed<string>(() => 'tag');

// table pagination
const tablePagination = ref<TablePagination>({
  page: 1,
  size: 10,
});

const onPaginationChange = (pagination: TablePagination) => {
  tablePagination.value = {...pagination};
};

// all table data
const allTableData = computed<TableData<GitRef>>(() => {
  const tags = plainClone(state.gitTags)
  tags.sort((a: GitRef, b: GitRef) => (a.name?.localeCompare(b.name || '') || 0) < 0 ? 1 : -1);
  return tags;
});

// table data
const tableData = computed<TableData<GitRef>>(() => {
  const {page, size} = tablePagination.value;
  return allTableData.value.filter((_, i) => (i >= (page - 1) * size) && (i < page * size));
});

// table columns
const tableColumns = computed<TableColumns<GitLog>>(() => {
  return [
    {
      key: 'name',
      label: gitRefType.value === GIT_REF_TYPE_BRANCH ?
        t('components.git.references.type.branch') :
        t('components.git.references.type.tag'),
      width: '1000',
      icon: gitRefType.value === GIT_REF_TYPE_BRANCH ? ['fa', 'code-branch'] : ['fa', 'tag']
    },
    {
      key: 'timestamp',
      label: t('components.git.references.table.columns.timestamp'),
      width: '200',
      icon: ['fa', 'clock'],
      fixed: 'right',
      value: (row: GitLog) => {
        if (!row.hash) return;
        const l = gitLogsMap.value.get(row.hash);
        if (!l?.timestamp) return;
        return h(Time, {time: l.timestamp, ago: false, format: 'YYYY-MM-DD hh:mm:ss A'});
      }
    }
  ] as TableColumns<GitLog>;
});

onBeforeMount(async () => {
  store.dispatch(`${ns}/getGitTags`, {id: activeId.value});
});
</script>

<template>
  <div class="git-tags">
    <cl-table
      :key="gitRefType"
      :columns="tableColumns"
      :data="tableData"
      :page="tablePagination.page"
      :page-size="tablePagination.size"
      :total="allTableData.length"
      :visible-buttons="[TABLE_ACTION_CUSTOMIZE_COLUMNS]"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<style scoped lang="scss">
.git-tags {
  height: 100%;

  .table {
    //height: 100%;
  }
}
</style>

<style scoped>
.git-tags >>> .el-table {
  border-top: none;
  border-left: none;
  border-right: none;
}

.git-tags >>> .el-table:before,
.git-tags >>> .el-table .el-table__inner-wrapper:before {
}
</style>
