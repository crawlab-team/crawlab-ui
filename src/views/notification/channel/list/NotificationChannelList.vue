<script setup lang="ts">
import useNotificationChannelList from '@/views/notification/channel/list/useNotificationChannelList.tsx';

const {
  navActions,
  tableColumns,
  tableData,
  tableTotal,
  tablePagination,
  actionFunctions,
} = useNotificationChannelList();
defineOptions({ name: 'ClNotificationChannelList' });
</script>

<template>
  <cl-list-layout
    class="notification-channel-list"
    :action-functions="actionFunctions"
    :nav-actions="navActions"
    :table-pagination="tablePagination"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
  >
    <template #extra>
      <!-- Dialogs (handled by store) -->
      <cl-create-edit-notification-channel-dialog />
      <!-- ./Dialogs -->
    </template>
  </cl-list-layout>
</template>

<style scoped></style>
