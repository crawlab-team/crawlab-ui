<script setup lang="ts">
import { useStore } from 'vuex';
import { useTaskDetail } from '@/views';
import { useTask } from '@/components';
import { isPro } from '@/utils';

const { activeTabName } = useTaskDetail();

const store = useStore();
const { allListSelectOptions } = useTask(store);

defineOptions({ name: 'ClTaskDetail' });
</script>

<template>
  <cl-detail-layout
    store-namespace="task"
    :all-list-select-options="allListSelectOptions"
  >
    <template #actions>
      <cl-task-detail-actions-common />
      <cl-task-detail-actions-logs v-if="activeTabName === 'logs'" />
      <template v-if="isPro()">
        <cl-task-detail-actions-data v-if="activeTabName === 'data'" />
      </template>
    </template>
  </cl-detail-layout>
</template>


