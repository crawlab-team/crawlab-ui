<script setup lang="ts">
import { computed } from 'vue';
import { translate } from '@/utils';
import { TagProps } from '@/components/ui/tag/types';

const props = defineProps<{
  dataSource?: DatabaseDataSource;
  iconOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// i18n
const t = translate;

const data = computed<TagProps>(() => {
  const { dataSource } = props;
  switch (dataSource) {
    case 'mongo':
      return {
        label: t('components.database.dataSources.mongo'),
        type: 'info',
        icon: ['svg', 'mongodb'],
      };
    case 'mysql':
      return {
        label: t('components.database.dataSources.mysql'),
        type: 'info',
        icon: ['svg', 'mysql'],
      };
    case 'postgres':
      return {
        label: t('components.database.dataSources.postgres'),
        type: 'info',
        icon: ['svg', 'postgres'],
      };
    case 'mssql':
      return {
        label: t('components.database.dataSources.mssql'),
        type: 'info',
        icon: ['svg', 'mssql'],
      };
    case 'oracle':
      return {
        label: t('components.database.dataSources.oracle'),
        type: 'info',
        icon: ['svg', 'oracle'],
      };
    case 'db2':
      return {
        label: t('components.database.dataSources.db2'),
        type: 'info',
        icon: ['svg', 'db2'],
      };
    case 'cassandra':
      return {
        label: t('components.database.dataSources.cassandra'),
        type: 'info',
        icon: ['svg', 'cassandra'],
      };
    case 'hive':
      return {
        label: t('components.database.dataSources.hive'),
        type: 'info',
        icon: ['svg', 'hive'],
      };
    case 'clickhouse':
      return {
        label: t('components.database.dataSources.clickhouse'),
        type: 'info',
        icon: ['svg', 'clickhouse'],
      };
    case 'snowflake':
      return {
        label: t('components.database.dataSources.snowflake'),
        type: 'info',
        icon: ['svg', 'snowflake'],
      };
    case 'elasticsearch':
      return {
        label: t('components.database.dataSources.elasticsearch'),
        type: 'info',
        icon: ['svg', 'elasticsearch'],
      };
    case 'redis':
      return {
        label: t('components.database.dataSources.redis'),
        type: 'info',
        icon: ['svg', 'redis'],
      };
    case 'kafka':
      return {
        label: t('components.database.dataSources.kafka'),
        type: 'info',
        icon: ['svg', 'kafka'],
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
  <template v-if="iconOnly">
    <span :style="{ width: '24px', height: '24px' }">
      <cl-icon :icon="data.icon" @click="emit('click')" />
    </span>
  </template>
  <template v-else>
    <cl-tag
      :icon="data.icon"
      :label="data.label"
      :tooltip="data.tooltip"
      :type="data.type"
      @click="emit('click')"
    />
  </template>
</template>
