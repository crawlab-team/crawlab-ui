<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  active?: boolean;
}>();

const type = computed<string>(() => {
  const { active } = props;
  return active ? 'success' : 'info';
});

const label = computed<string>(() => {
  const { active } = props;
  return active ? 'Online' : 'Offline';
});

const icon = computed<string[]>(() => {
  const { active } = props;
  return active ? ['fa', 'check-circle'] : ['fa', 'times-circle'];
});
defineOptions({ name: 'ClNodeActive' });
</script>

<template>
  <el-tag :type="type" class="node-active">
    <font-awesome-icon :icon="icon" class="icon" />
    <span>{{ label }}</span>
  </el-tag>
</template>

<style scoped>
.node-active {
  .icon {
    margin-right: 5px;
  }
}
</style>
