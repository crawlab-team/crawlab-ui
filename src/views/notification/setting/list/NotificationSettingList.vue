<script setup lang="ts">
import useNotificationSettingList from '@/views/notification/setting/list/useNotificationSettingList.tsx';

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
} = useNotificationSettingList();
defineOptions({ name: 'ClNotificationSettingList' });
</script>

<template>
  <cl-list-layout
    class="notification-setting-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-notification-setting-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped></style>
