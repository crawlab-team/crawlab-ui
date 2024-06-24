<script setup lang="ts">
defineOptions({ name: 'ClInputList' });
import { ref, watch } from 'vue';
import { cloneArray, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    placeholder: string;
    size: BasicSize;
    actionSize: BasicSize;
    disabled: boolean;
  }>(),
  {
    modelValue: () => [''],
    placeholder: '',
    size: 'small',
    actionSize: 'small',
  }
);

const emit = defineEmits<{
  (e: 'update:model-value', value: string[]): void;
}>();

// i18n
const t = translate;

const internalModelValue = ref(props.modelValue);

const getOnChangeFn = (index: number) => {
  return (value: string) => {
    const newModelValue = cloneArray(internalModelValue.value || []);
    newModelValue[index] = value;
    emit('update:model-value', newModelValue);
  };
};

const onAdd = (index: number) => {
  const newModelValue = cloneArray(internalModelValue.value || []);
  newModelValue.splice(index + 1, 0, '');
  internalModelValue.value = newModelValue;
  emit('update:model-value', newModelValue);
};

const onDelete = (index: number) => {
  const newModelValue = cloneArray(internalModelValue.value || []);
  newModelValue.splice(index, 1);
  if (newModelValue.length === 0) {
    newModelValue.push('');
  }
  internalModelValue.value = newModelValue;
  emit('update:model-value', newModelValue);
};

watch(
  () => props.modelValue,
  () => {
    internalModelValue.value = props.modelValue || [''];
  }
);
</script>

<template>
  <div class="input-list">
    <div
      class="input-list-item"
      v-for="(_, $index) in internalModelValue"
      :key="$index"
    >
      <el-input
        v-model="internalModelValue[$index]"
        :placeholder="placeholder"
        :size="size"
        :disabled="disabled"
        @change="getOnChangeFn($index)"
      />
      <div class="actions">
        <cl-tag
          clickable
          :icon="['fa', 'plus']"
          :size="actionSize"
          :disabled="disabled"
          effect="plain"
          type="info"
          :tooltip="t('common.actions.add')"
          @click="() => onAdd($index)"
        />
        <cl-tag
          clickable
          :icon="['fa', 'xmark']"
          :size="actionSize"
          :disabled="disabled"
          effect="plain"
          type="info"
          :tooltip="t('common.actions.delete')"
          @click="() => onDelete($index)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-list {
  display: flex;
  flex-direction: column;

  .input-list-item {
    display: flex;
    align-items: center;

    &:not(:first-child) {
      margin-top: 5px;
    }

    .el-input {
      flex: 1 0;
    }

    .actions {
      padding-left: 5px;
    }
  }
}
</style>
