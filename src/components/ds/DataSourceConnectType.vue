<script setup lang="ts">
defineOptions({ name: 'ClDataSourceConnectType' });
import { computed } from 'vue';
import {
  DATA_SOURCE_CONNECT_TYPE_STANDARD,
  DATA_SOURCE_CONNECT_TYPE_URL,
  DATA_SOURCE_CONNECT_TYPE_HOSTS,
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
  switch (dataSource?.connect_type) {
    case DATA_SOURCE_CONNECT_TYPE_STANDARD:
      return {
        label: t('components.ds.connectType.label.standard'),
        icon: ['fa', 'sliders'],
        type: 'primary',
      };
    case DATA_SOURCE_CONNECT_TYPE_URL:
      return {
        label: t('components.ds.connectType.label.url'),
        icon: ['fa', 'at'],
        type: 'primary',
      };
    case DATA_SOURCE_CONNECT_TYPE_HOSTS:
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
