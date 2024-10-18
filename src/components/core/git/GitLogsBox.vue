<script setup lang="ts">
defineProps<{
  visible?: boolean;
  loading?: boolean;
  title?: string;
  logs?: string[];
}>();

defineOptions({ name: 'ClGitLogsBox' });
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

<style scoped>
.logs-list {
  min-height: 240px;
}
</style>
