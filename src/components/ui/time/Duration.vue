<script setup lang="ts">
import { computed, PropType } from 'vue';
import humanizeDuration from 'humanize-duration';
import { getLanguage } from '@/utils/i18n';

const props = withDefaults(
  defineProps<{
    duration?: number;
    isTag?: boolean;
    size?: BasicSize;
    tooltip?: string;
    icon?: Icon;
    type?: BasicType;
  }>(),
  {
    size: 'default',
    icon: () => ['fa', 'stopwatch'],
    type: 'primary',
  }
);

const label = computed<string>(() => {
  const { duration } = props;

  const d = Math.ceil((duration as number) / 1000) * 1000;

  const language = getLanguage();

  return humanizeDuration(d, {
    spacer: ' ',
    language,
  });
});
defineOptions({ name: 'ClDuration' });
</script>

<template>
  <div v-if="!isTag" class="duration">
    {{ label }}
  </div>
  <cl-tag
    v-else
    class-name="duration"
    :icon="icon"
    :label="label"
    :size="size"
    :tooltip="tooltip"
    :type="type"
  />
</template>


