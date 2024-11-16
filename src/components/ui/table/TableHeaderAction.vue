<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tooltip?: string | Record<string, string>;
    isHtml?: boolean;
    icon?: string | string[];
    status?: TableHeaderActionStatus;
  }>(),
  {
    status: () => ({ active: false, focused: false }),
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const classes = computed<string[]>(() => {
  const { status } = props as TableHeaderActionProps;
  if (!status) return [];
  const { active, focused } = status;
  const cls = [];
  if (active) cls.push('active');
  if (focused) cls.push('focused');
  return cls;
});

const onClick = () => {
  emit('click');
};
defineOptions({ name: 'ClTableHeaderAction' });
</script>

<template>
  <span :class="classes" class="action" @click="onClick">
    <el-tooltip :content="tooltip">
      <template v-if="isHtml" #content>
        <div v-html="tooltip" />
      </template>
      <div>
        <cl-icon :icon="icon" />
      </div>
    </el-tooltip>
  </span>
</template>

<style scoped>
.action {
  margin-left: 3px;
  font-size: 10px;

  &:hover {
    color: var(--cl-primary-color);
  }

  &.focused {
    display: inline !important;
    color: var(--cl-primary-color);
  }

  &.active {
    display: inline !important;
    color: var(--cl-warning-color);
  }
}
</style>
