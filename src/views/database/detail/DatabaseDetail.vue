<script setup lang="ts">
import { useStore } from 'vuex';
import { useDatabaseDetail } from '@/views';
import { TAB_NAME_CONSOLE } from '@/constants';
import { useDatabase } from '@/components';

const { activeTabName } = useDatabaseDetail();

const store = useStore();
const { allListSelectOptions } = useDatabase(store);

defineOptions({ name: 'ClDatabaseDetail' });
</script>

<template>
  <cl-detail-layout
    store-namespace="database"
    :all-list-select-options="allListSelectOptions"
  >
    <template #actions>
      <cl-database-detail-actions-common />
      <cl-database-detail-actions-console
        v-if="activeTabName === TAB_NAME_CONSOLE"
      />
    </template>
  </cl-detail-layout>
</template>
