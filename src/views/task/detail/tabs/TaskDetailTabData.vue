<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import useTask from '@/components/core/task/useTask';
import { useTaskDetail } from '@/views';
import { FILTER_OP_EQUAL } from '@/constants';
import { isPro } from '@/utils';

const store = useStore();
const { task: state } = store.state as RootStoreState;

const { form } = useTask(store);

const { activeId } = useTaskDetail();

const filter = computed<FilterConditionData[]>(() => {
  return [
    {
      key: '_tid',
      op: FILTER_OP_EQUAL,
      value: activeId.value,
    },
  ];
});

const displayAllFields = computed<boolean>(() => state.dataDisplayAllFields);

defineOptions({ name: 'ClTaskDetailTabData' });
</script>

<template>
  <div class="task-detail-tab-data">
    <template v-if="isPro()">
      <cl-task-result-data-with-database
        :display-all-fields="displayAllFields"
      />
    </template>
    <template v-else>
      <cl-result-list
        :spider-id="form?.spider_id"
        :filter="filter"
        :display-all-fields="displayAllFields"
        no-actions
        embedded
      />
    </template>
  </div>
</template>

<style scoped>
.task-detail-tab-data:deep(.el-table) {
  border: none;
}
</style>
