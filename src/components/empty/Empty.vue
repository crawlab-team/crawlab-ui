<script setup lang="ts">
defineOptions({ name: 'ClEmpty' });
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
</script>

<template>
  <div class="empty">
    <cl-img-empty />
    <div class="description">
      {{ t(description) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
