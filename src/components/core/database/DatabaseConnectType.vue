<script setup lang="ts">
import { computed } from 'vue';
import {
  DATABASE_CONNECT_TYPE_STANDARD,
  DATABASE_CONNECT_TYPE_URL,
  DATABASE_CONNECT_TYPE_HOSTS,
} from '@/constants/database';
import { translate } from '@/utils';

const props = defineProps<{
  database?: Database;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// i18n
const t = translate;

const data = computed<TagProps>(() => {
  const { database } = props;
  switch (database?.connect_type) {
    case DATABASE_CONNECT_TYPE_STANDARD:
      return {
        label: t('components.database.connectType.label.standard'),
        icon: ['fa', 'sliders'],
        type: 'primary',
      };
    case DATABASE_CONNECT_TYPE_URL:
      return {
        label: t('components.database.connectType.label.url'),
        icon: ['fa', 'at'],
        type: 'primary',
      };
    case DATABASE_CONNECT_TYPE_HOSTS:
      return {
        label: t('components.database.connectType.label.hosts'),
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
