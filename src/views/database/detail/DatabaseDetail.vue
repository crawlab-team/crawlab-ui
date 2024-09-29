<script setup lang="ts">
import { useDatabaseDetail } from '@/views';
import ClDatabaseDetailActionsConsole from '@/views/database/detail/actions/DatabaseDetailActionsConsole.vue';
import { TAB_NAME_CONSOLE } from '@/constants';

const { activeTabName } = useDatabaseDetail();

defineOptions({ name: 'ClDatabaseDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="database">
    <template #actions>
      <cl-database-detail-actions-common />
      <cl-database-detail-actions-console
        v-if="activeTabName === TAB_NAME_CONSOLE"
      />
    </template>
  </cl-detail-layout>
</template>
