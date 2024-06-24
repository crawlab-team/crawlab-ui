<script setup lang="ts">
defineOptions({ name: 'ClFaIconButton' });
import { computed } from 'vue';

interface ButtonProps {
  tooltip?: string;
  type?: BasicType;
  size?: BasicSize;
  round?: boolean;
  circle?: boolean;
  plain?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
  noMargin?: boolean;
}

const props = defineProps<
  ButtonProps & {
    icon: Icon;
    badgeIcon?: Icon;
    spin?: boolean;
  }
>();

const emit = defineEmits<{
  (e: 'click', event: Event): void;
}>();

const cls = computed<string>(() => {
  const { className } = props;
  const classes = ['fa-icon-button'];
  if (className) classes.push(className);
  return classes.join(' ');
});
</script>

<template>
  <cl-button
    :circle="circle"
    :disabled="disabled"
    :plain="plain"
    :round="round"
    :size="size"
    :tooltip="tooltip"
    :type="type"
    is-icon
    :id="id"
    :class-name="cls"
    @click="(event: Event) => emit('click', event)"
  >
    <cl-icon :icon="icon" :spin="spin" />
    <div v-if="badgeIcon" class="badge-icon">
      <cl-icon :icon="badgeIcon" />
    </div>
  </cl-button>
</template>

<style lang="scss" scoped>
.badge-icon {
  position: absolute;
  top: -2px;
  right: 2px;
  font-size: 8px;
  color: var(--cl-white);
}
</style>
