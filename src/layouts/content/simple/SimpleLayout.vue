<script setup lang="ts">
defineOptions({ name: 'ClSimpleLayout' });
withDefaults(
  defineProps<{
    background?: string;
    padding?: string;
  }>(),
  {
    background: '#ffffff',
  }
);
</script>

<template>
  <div class="simple-layout" :style="{ background, padding }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.simple-layout {
  padding: 20px;
  min-height: 100%;
}
</style>
