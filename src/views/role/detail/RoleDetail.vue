<script setup lang="ts">
import { useRoleDetail } from '@/views';
import { TAB_NAME_PAGES } from '@/constants';

const { activeTabName } = useRoleDetail();

defineOptions({ name: 'ClRoleDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="role">
    <template #actions>
      <cl-role-detail-actions-pages v-if="activeTabName === TAB_NAME_PAGES" />
    </template>
  </cl-detail-layout>
</template>
