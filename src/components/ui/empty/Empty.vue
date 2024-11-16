<script setup lang="ts">
import { translate } from '@/utils';

const t = translate;

withDefaults(
  defineProps<{
    description?: string;
  }>(),
  {
    description: 'components.empty.noDataAvailable',
  }
);
defineOptions({ name: 'ClEmpty' });
</script>

<template>
  <div class="empty">
    <cl-img-empty />
    <div class="description">
      {{ t(description) }}
    </div>
  </div>
</template>

<style scoped>
.empty {
  max-height: 240px;
  display: flex;
  flex-direction: column;

  .description {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>
