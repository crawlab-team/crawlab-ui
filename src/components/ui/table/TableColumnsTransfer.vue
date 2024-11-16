<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  visible?: boolean;
  columns?: TableColumn[];
  selectedColumnKeys?: string[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'change', value: string[]): void;
  (e: 'sort', value: string[]): void;
  (e: 'confirm', value: string[]): void;
}>();

// i18n
const t = translate;

const internalSelectedColumnKeys = ref<string[]>([]);

const computedData = computed<any[]>(() => {
  const { columns } = props as TableColumnsTransferProps;
  return columns.map(d => {
    const { key, label, disableTransfer } = d;
    return {
      key,
      label,
      disabled: disableTransfer || false,
    };
  });
});

const onClose = () => {
  emit('close');
};

const onChange = (value: string[]) => {
  internalSelectedColumnKeys.value = value;
};

const onConfirm = () => {
  emit('confirm', internalSelectedColumnKeys.value);
  emit('close');
};

onBeforeMount(() => {
  const { selectedColumnKeys } = props as TableColumnsTransferProps;
  internalSelectedColumnKeys.value = selectedColumnKeys || [];
});
defineOptions({ name: 'ClTableColumnsTransfer' });
</script>

<template>
  <el-dialog
    :before-close="onClose"
    :model-value="visible"
    :title="t('components.table.columnsTransfer.title')"
  >
    <div class="table-columns-transfer-content">
      <cl-transfer
        :data="computedData"
        :titles="[
          t('components.table.columnsTransfer.titles.left'),
          t('components.table.columnsTransfer.titles.right'),
        ]"
        :value="internalSelectedColumnKeys"
        @change="onChange"
      />
    </div>
    <template #footer>
      <cl-button plain type="info" @click="onClose">
        {{ t('common.actions.cancel') }}
      </cl-button>
      <cl-button @click="onConfirm">
        {{ t('common.actions.confirm') }}
      </cl-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.table-columns-transfer-content {
  display: flex;
  justify-content: center;
}
</style>
