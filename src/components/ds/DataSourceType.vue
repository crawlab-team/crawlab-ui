<script setup lang="ts">
defineOptions({ name: 'ClDataSourceType' });
import { computed } from 'vue';
import {
  DATA_SOURCE_TYPE_MONGO,
  DATA_SOURCE_TYPE_MYSQL,
  DATA_SOURCE_TYPE_POSTGRESQL,
  DATA_SOURCE_TYPE_MSSQL,
  DATA_SOURCE_TYPE_SQLITE,
  DATA_SOURCE_TYPE_COCKROACHDB,
  DATA_SOURCE_TYPE_ELASTICSEARCH,
  DATA_SOURCE_TYPE_KAFKA,
} from '@/constants/ds';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  dataSource?: DataSource;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// i18n
const { t } = useI18n();

const data = computed<TagProps>(() => {
  const { dataSource } = props;
  switch (dataSource?.type) {
    case DATA_SOURCE_TYPE_MONGO:
      return {
        label: t('components.ds.type.mongo'),
        type: 'success',
        icon: ['fa', 'file-lines'],
      };
    case DATA_SOURCE_TYPE_ELASTICSEARCH:
      return {
        label: t('components.ds.type.elasticsearch'),
        type: 'success',
        icon: ['fa', 'file-lines'],
      };
    case DATA_SOURCE_TYPE_MYSQL:
      return {
        label: t('components.ds.type.mysql'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATA_SOURCE_TYPE_POSTGRESQL:
      return {
        label: t('components.ds.type.postgresql'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATA_SOURCE_TYPE_MSSQL:
      return {
        label: t('components.ds.type.mssql'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATA_SOURCE_TYPE_SQLITE:
      return {
        label: t('components.ds.type.sqlite'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATA_SOURCE_TYPE_COCKROACHDB:
      return {
        label: t('components.ds.type.cockroachdb'),
        type: 'primary',
        icon: ['fa', 'table'],
      };
    case DATA_SOURCE_TYPE_KAFKA:
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
