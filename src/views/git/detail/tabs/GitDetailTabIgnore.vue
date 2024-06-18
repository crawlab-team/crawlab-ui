<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import useGitDetail from '@/views/git/detail/useGitDetail';

// i18n
const { t } = useI18n();

// store
const ns = 'spider';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId } = useGitDetail();

// table data
const tableData = computed<TableData<{ name: string; index: number }>>(
  () =>
    state.gitData?.ignore
      ?.filter(d => !!d.trim() && !d.trim().startsWith('#'))
      ?.map((d, i) => {
        return {
          name: d,
          index: i,
        };
      }) || []
);

// table columns
const tableColumns = computed<TableColumns<string>>(() => {
  return [
    {
      key: 'name',
      label: t('components.git.ignore.table.columns.file'),
      width: '1100',
    },
  ] as TableColumns<string>;
});

watch(
  () => activeId.value,
  () => store.dispatch(`${ns}/getGit`, { id: activeId.value })
);
onBeforeMount(() => store.dispatch(`${ns}/getGit`, { id: activeId.value }));
</script>

<template>
  <div class="git-ignore">
    <cl-table
      :columns="tableColumns"
      :data="tableData"
      height="calc(100% - 1px)"
      hide-footer
    />
  </div>
</template>

<style scoped lang="scss">
.git-ignore {
  height: 100%;

  .table {
    height: 100%;
  }
}
</style>

<style scoped>
.git-ignore >>> .el-table {
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
