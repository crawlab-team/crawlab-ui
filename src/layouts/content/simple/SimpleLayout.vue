<script setup lang="ts">
withDefaults(
  defineProps<{
    background?: string;
    padding?: string;
  }>(),
  {
    background: '#ffffff',
  }
);
defineOptions({ name: 'ClSimpleLayout' });
</script>

<template>
  <div class="simple-layout" :style="{ background, padding }">
    <slot></slot>
  </div>
</template>

<style scoped>
.simple-layout {
  padding: 20px;
  min-height: 100%;
}
</style>
