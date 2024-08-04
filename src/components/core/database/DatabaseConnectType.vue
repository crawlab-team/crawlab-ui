<script setup lang="ts">
import { computed } from 'vue';
import {
  DATABASE_CONNECT_TYPE_STANDARD,
  DATABASE_CONNECT_TYPE_URL,
  DATABASE_CONNECT_TYPE_HOSTS,
} from '@/constants/database';
import { translate } from '@/utils';

const props = defineProps<{
  dataSource?: Database;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// i18n
const t = translate;

const data = computed<TagProps>(() => {
  const { dataSource } = props;
  switch (dataSource?.connect_type) {
    case DATABASE_CONNECT_TYPE_STANDARD:
      return {
        label: t('components.ds.connectType.label.standard'),
        icon: ['fa', 'sliders'],
        type: 'primary',
      };
    case DATABASE_CONNECT_TYPE_URL:
      return {
        label: t('components.ds.connectType.label.url'),
        icon: ['fa', 'at'],
        type: 'primary',
      };
    case DATABASE_CONNECT_TYPE_HOSTS:
      return {
        label: t('components.ds.connectType.label.hosts'),
        icon: ['fa', 'diagram-project'],
        type: 'primary',
      };
    default:
      return {
        label: 'Unknown',
        type: 'info',
        icon: ['fa', 'question'],
      };
  }
});
defineOptions({ name: 'ClDatabaseConnectType' });
</script>

<template>
  <cl-tag
    :icon="data.icon"
    :label="data.label"
    :tooltip="data.tooltip"
    :type="data.type"
    @click="emit('click')"
  />
</template>

<style lang="scss" scoped></style>
