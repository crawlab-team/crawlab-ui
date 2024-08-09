<script setup lang="ts">
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const { database: state } = store.state as RootStoreState;

const form = computed<Database>(() => state.form);
defineOptions({ name: 'ClDatabaseDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'database']" />
    <cl-nav-action-item>
      <cl-database-status
        :status="form.status"
        :error="form.error"
        size="large"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>
