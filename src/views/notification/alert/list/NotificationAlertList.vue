<script setup lang="ts">
import { useNotificationAlertList } from '@/views';

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
} = useNotificationAlertList();

defineOptions({ name: 'ClNotificationAlertList' });
</script>

<template>
  <cl-list-layout
    class="notification-alert-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-notification-alert-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped>
.notification-alert-content {
  width: 100%;
  padding: 20px;
  text-align: left;

  pre {
    width: 100%;
    overflow: auto;
    font-size: 14px;
  }
}
</style>
