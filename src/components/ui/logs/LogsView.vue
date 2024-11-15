<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  logs?: string[];
}>();

const content = computed(() => {
  const { logs } = props;
  const data: string[] = [];
  logs?.forEach(l => {
    l.trim()
      .split(/[\n\r]/)
      .map(line => {
        data.push(line.trim());
      });
  });
  return data.join('\n');
});

const logsViewRef = ref<HTMLDivElement>();

const scrollToBottom = () => {
  logsViewRef.value?.scrollTo(0, logsViewRef.value?.scrollHeight);
};

defineExpose({
  scrollToBottom,
});
defineOptions({ name: 'ClLogsView' });
</script>

<template>
  <div class="logs-view" ref="logsViewRef">
    <pre>{{ content }}</pre>
  </div>
</template>

<style scoped>
.logs-view {
  border: 1px solid rgb(244, 244, 245);
  padding: 10px;
  overflow: auto;
  min-height: 480px;
  max-height: 560px;
}
</style>
