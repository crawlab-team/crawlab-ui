<script setup lang="ts">
import { computed } from 'vue';
import {
  DATABASE_TYPE_MONGO,
  DATABASE_TYPE_MYSQL,
  DATABASE_TYPE_POSTGRESQL,
  DATABASE_TYPE_MSSQL,
  DATABASE_TYPE_ELASTICSEARCH,
  DATABASE_TYPE_KAFKA,
  DATABASE_TYPE_REDIS,
} from '@/constants/database';
import { translate } from '@/utils';

const props = defineProps<{
  dataSource?: DatabaseDataSource;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// i18n
const t = translate;

const data = computed<TagProps>(() => {
  const { dataSource } = props;
  switch (dataSource) {
    case DATABASE_TYPE_MONGO:
      return {
        label: t('components.database.dataSources.mongo'),
        type: 'info',
        icon: ['svg', 'mongodb'],
      };
    case DATABASE_TYPE_ELASTICSEARCH:
      return {
        label: t('components.database.dataSources.elasticsearch'),
        type: 'info',
        icon: ['svg', 'elasticsearch'],
      };
    case DATABASE_TYPE_MYSQL:
      return {
        label: t('components.database.dataSources.mysql'),
        type: 'info',
        icon: ['svg', 'mysql'],
      };
    case DATABASE_TYPE_POSTGRESQL:
      return {
        label: t('components.database.dataSources.postgresql'),
        type: 'info',
        icon: ['svg', 'postgres'],
      };
    case DATABASE_TYPE_MSSQL:
      return {
        label: t('components.database.dataSources.mssql'),
        type: 'info',
        icon: ['svg', 'mssql'],
      };
    case DATABASE_TYPE_KAFKA:
      return {
        label: t('components.database.dataSources.kafka'),
        type: 'info',
        icon: ['svg', 'kafka'],
      };
    case DATABASE_TYPE_REDIS:
      return {
        label: t('components.database.dataSources.redis'),
        type: 'info',
        icon: ['svg', 'redis'],
      };
    default:
      return {
        label: 'Unknown',
        type: 'info',
        icon: ['fa', 'question'],
      };
  }
});
defineOptions({ name: 'ClDatabaseDataSource' });
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
