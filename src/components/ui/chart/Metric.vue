<script setup lang="ts">
import { computed, StyleValue } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  title?: string;
  value?: number | string;
  icon?: Icon;
  color?: string;
  clickable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const style = computed<StyleValue>(() => {
  const { color } = props;
  return {
    backgroundColor: color,
  };
});

const onClick = () => {
  const { clickable } = props;
  if (!clickable) return;
  emit('click');
};
defineOptions({ name: 'ClMetric' });
</script>

<template>
  <div
    :class="[clickable ? 'clickable' : '']"
    :style="style"
    class="metric"
    @click="onClick"
  >
    <div class="background" />
    <div class="icon">
      <cl-icon :icon="icon" />
    </div>
    <div class="info">
      <div class="title">
        {{ t(title || '') }}
      </div>
      <div class="value">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.metric {
  padding: 10px;
  margin: 20px;
  display: flex;
  border: 1px solid var(--cl-info-light-color);
  border-radius: 5px;
  position: relative;

  &.clickable {
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }

  .background {
    position: absolute;
    left: calc(64px + 10px);
    top: 0;
    width: calc(100% - 64px - 10px);
    height: 100%;
    background-color: var(--cl-white);
    opacity: 0.3;
    z-index: 1;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-basis: 64px;
    font-size: 32px;
    color: white;
    padding-right: 10px;
    z-index: 2;
  }

  .info {
    margin-left: 20px;
    height: 48px;
    color: white;
    z-index: 2;

    .title {
      height: 24px;
      line-height: 24px;
      font-weight: bolder;
    }

    .value {
      height: 24px;
      line-height: 24px;
      font-weight: bold;
    }
  }
}
</style>
