<script setup lang="ts">
import { computed } from 'vue';
import {
  DATABASE_TYPE_MONGO,
  DATABASE_TYPE_MYSQL,
  DATABASE_TYPE_POSTGRESQL,
  DATABASE_TYPE_MSSQL,
  DATABASE_TYPE_SQLITE,
  DATABASE_TYPE_COCKROACHDB,
  DATABASE_TYPE_ELASTICSEARCH,
  DATABASE_TYPE_KAFKA,
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
  switch (dataSource?.type) {
    case DATABASE_TYPE_MONGO:
      return {
        label: t('components.ds.type.mongo'),
        type: 'success',
        icon: ['fa', 'file-lines'],
      };
    case DATABASE_TYPE_ELASTICSEARCH:
      return {
        label: t('components.ds.type.elasticsearch'),
        type: 'success',
        icon: ['fa', 'file-lines'],
      };
    case DATABASE_TYPE_MYSQL:
      return {
        label: t('components.ds.type.mysql'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATABASE_TYPE_POSTGRESQL:
      return {
        label: t('components.ds.type.postgresql'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATABASE_TYPE_MSSQL:
      return {
        label: t('components.ds.type.mssql'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATABASE_TYPE_SQLITE:
      return {
        label: t('components.ds.type.sqlite'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATABASE_TYPE_COCKROACHDB:
      return {
        label: t('components.ds.type.cockroachdb'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATABASE_TYPE_KAFKA:
      return {
        label: t('components.ds.type.kafka'),
        type: 'warning',
        icon: ['fa', 'diagram-project'],
      };
    default:
      return {
        label: 'Unknown',
        type: 'info',
        icon: ['fa', 'question'],
      };
  }
});
defineOptions({ name: 'ClDatabaseType' });
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
