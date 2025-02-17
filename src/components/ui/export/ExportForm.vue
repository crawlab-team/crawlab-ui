<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  defaultType?: ExportType;
  target?: string;
}>();

const emit = defineEmits<{
  (e: 'export-type-change', value: string): void;
}>();

// i18n
const t = translate;

const exportType = ref<ExportType>();

const onExportTypeChange = (value: string) => {
  emit('export-type-change', value);
};

onBeforeMount(() => {
  exportType.value = props.defaultType;
});
defineOptions({ name: 'ClExportForm' });
</script>

<template>
  <cl-form label-width="100px">
    <cl-form-item :label="t('components.export.target')" :span="4">
      <cl-tag :label="target" size="large" />
    </cl-form-item>
    <cl-form-item :label="t('components.export.type')" :span="4">
      <el-select v-model="exportType" @change="onExportTypeChange">
        <el-option value="csv" :label="t('components.export.types.csv')" />
        <el-option value="json" :label="t('components.export.types.json')" />
      </el-select>
    </cl-form-item>
  </cl-form>
</template>

<style scoped>
.el-form {
  width: 100%;

  .el-form-item {
    width: 100%;

    .el-select {
      width: 100%;
    }
  }
}
</style>
