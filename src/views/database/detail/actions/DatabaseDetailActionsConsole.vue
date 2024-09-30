<script setup lang="ts">
import { translate } from '@/utils';
import { useStore } from 'vuex';
import { useDatabaseDetail } from '@/views';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const { activeId } = useDatabaseDetail();

const runQueryLoading = computed(() => state.consoleQueryLoading);

const onRunQuery = async () => {
  await store.dispatch(`${ns}/runQuery`, { id: activeId.value });
};

defineOptions({ name: 'ClDatabaseDetailActionsConsole' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'terminal']" />
    <cl-nav-action-item>
      <cl-fa-icon-button
        :loading="runQueryLoading"
        :disabled="runQueryLoading"
        :icon="runQueryLoading ? ['fa', 'spinner'] : ['fa', 'play']"
        :spin="runQueryLoading"
        :tooltip="t('components.database.actions.runQuery')"
        type="success"
        @click="onRunQuery"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped></style>
