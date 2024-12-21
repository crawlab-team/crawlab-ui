<script setup lang="ts">
import { useScheduleList } from '@/views';

defineProps<{
  noActions?: boolean;
  embedded?: boolean;
}>();

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
} = useScheduleList();

defineOptions({ name: 'ClScheduleList' });
</script>

<template>
  <cl-list-layout
    class="schedule-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :no-actions="noActions"
    :embedded="embedded"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-schedule-dialog />
      <cl-run-schedule-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>
