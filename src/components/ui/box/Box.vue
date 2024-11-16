<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    title?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    closable?: boolean;
    type?: BasicType;
    icon?: Icon;
    loading?: boolean;
    zIndex?: number;
  }>(),
  {
    position: 'top-right',
    closable: true,
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const cls = computed<string>(() => {
  const { position } = props;
  return [position].join(' ');
});
defineOptions({ name: 'ClBox' });
</script>

<template>
  <div
    class="box"
    :class="cls"
    :style="{
      zIndex: visible ? props.zIndex : -1,
      opacity: visible ? 1 : 0,
    }"
  >
    <el-card>
      <template #header>
        <div class="title" :class="type">
          <div v-if="loading || icon" class="icon-wrapper">
            <cl-icon v-if="loading" :icon="['fa', 'spinner']" spinning />
            <cl-icon v-else :icon="icon || ''" />
          </div>
          <template v-if="$slots.title">
            <slot name="title" />
          </template>
          <template v-else>
            {{ title }}
          </template>
        </div>
      </template>
      <slot />
    </el-card>
  </div>
</template>

<style scoped>
.box {
  position: fixed;
  z-index: 999;
  min-width: 360px;
  transition: opacity 0.3s;

  &.top-right {
    top: var(--cl-header-height);
    right: 20px;
  }

  &.top-left {
    top: var(--cl-header-height);
    left: 20px;
  }

  &.bottom-right {
    bottom: 20px;
    right: 20px;
  }

  &.bottom-left {
    bottom: 20px;
    left: 20px;
  }

  .title {
    display: flex;
    align-items: center;

    &.info {
      .icon-wrapper {
        color: var(--cl-info-color);
      }
    }

    &.success {
      .icon-wrapper {
        color: var(--cl-success-color);
      }
    }

    &.warning {
      .icon-wrapper {
        color: var(--cl-warning-color);
      }
    }

    &.danger {
      .icon-wrapper {
        color: var(--cl-danger-color);
      }
    }

    .icon {
      margin-right: 10px;
      width: 24px;
    }
  }
}
</style>
<style scoped>
.box:deep(.title .icon) {
  margin-right: 10px;
  width: 24px;
}
</style>
