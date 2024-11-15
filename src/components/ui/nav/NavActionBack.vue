<script setup lang="ts">
import { translate } from '@/utils';
import type { ButtonType } from '@/components/ui/button/types';

export interface NavActionBackProps {
  buttonType?: ButtonType;
  label?: string;
  tooltip?: string;
  icon?: Icon;
  type?: BasicType;
  size?: BasicSize;
  disabled?: boolean;
}

withDefaults(defineProps<NavActionBackProps>(), {
  buttonType: 'label',
  label: 'components.nav.actions.back',
  icon: () => ['fa', 'undo'],
  type: 'primary',
  size: 'default',
  disabled: false,
});

defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

defineOptions({ name: 'ClNavActionBack' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-button
      :button-type="buttonType"
      :disabled="disabled"
      :icon="icon"
      :label="t(label)"
      :tooltip="tooltip"
      type="primary"
      @click="() => $emit('click')"
    />
  </cl-nav-action-group>
</template>
