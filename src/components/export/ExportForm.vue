<script setup lang="ts">
defineOptions({ name: 'ClExportForm' });
import { onBeforeMount, ref } from 'vue';
import { translate } from '@/utils';
import { ExportType } from '@/directives/export/export';

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
</script>

<template>
  <el-form inline label-width="100px">
    <el-form-item :label="t('components.export.type')">
      <el-select v-model="exportType" @change="onExportTypeChange">
        <el-option value="csv" :label="t('components.export.types.csv')" />
        <el-option value="json" :label="t('components.export.types.json')" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    width: 100%;

    .el-select {
      width: 100%;
    }
  }
}
</style>
