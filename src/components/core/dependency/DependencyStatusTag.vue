<script setup lang="ts">
import { computed } from 'vue';
import { TagProps } from '@/components/ui/tag/types';
import { translate } from '@/utils';

const props = defineProps<{
  status?: DependencyStatus;
  size?: BasicSize;
  clickDisabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const tagProps = computed<TagProps>(() => {
  const { status, size, clickDisabled } = props;
  let tagProps: TagProps;
  switch (status) {
    case 'installed':
      tagProps = {
        icon: ['fa', 'check'],
        type: 'success',
        clickable: true,
      };
      break;
    case 'installing':
    case 'uninstalling':
      tagProps = {
        icon: ['fa', 'spinner'],
        type: 'warning',
        spinning: true,
        clickable: true,
      };
      break;
    case 'error':
    case 'abnormal':
      tagProps = {
        icon: ['fa', 'times'],
        type: 'danger',
        clickable: true,
      };
      break;
    case 'uninstalled':
      tagProps = {
        icon: ['fa', 'download'],
        type: 'info',
        clickable: true,
      };
      break;
    default:
      tagProps = {
        icon: ['fa', 'question'],
        type: 'info',
        clickable: false,
      };
  }
  if (status) {
    tagProps.label = t(`views.env.deps.dependency.status.${status}`);
  } else {
    tagProps.label = t('common.status.unknown');
  }
  if (clickDisabled) {
    tagProps.clickable = false;
  }
  if (typeof size !== 'undefined') {
    tagProps.size = size;
  }
  return tagProps;
});

defineOptions({ name: 'ClDependencyStatusTag' });
</script>

<template>
  <cl-tag
    :label="tagProps.label"
    :icon="tagProps.icon"
    :type="tagProps.type"
    :size="tagProps.size"
    :spinning="tagProps.spinning"
    :clickable="tagProps.clickable"
    @click="emit('click')"
  />
</template>
