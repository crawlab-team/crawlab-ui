<script setup lang="ts">
defineOptions({ name: 'ClGitLogsBox' });

import { translate } from '@/utils';

defineProps<{
  visible?: boolean;
  loading?: boolean;
  title?: string;
  logs?: string[];
}>();

const t = translate;
</script>

<template>
  <cl-box
    :visible="logs?.length && visible"
    :loading="loading"
    :title="title"
    :type="loading ? 'warning' : 'info'"
  >
    <template v-if="logs">
      <div class="logs-list">
        <div v-for="(log, $index) in logs" :key="$index">
          {{ log }}
        </div>
      </div>
    </template>
  </cl-box>
</template>

<style scoped lang="scss">
.logs-list {
  min-height: 240px;
}
</style>
