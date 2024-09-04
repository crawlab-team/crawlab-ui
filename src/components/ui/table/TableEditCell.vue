<script setup lang="tsx">
import { computed, onMounted, ref, watch } from 'vue';
import {
  ElInput,
  ElAutocomplete,
  type AutocompleteFetchSuggestions,
} from 'element-plus';
import { ClIcon } from '@/components';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    isEdit?: boolean;
    required?: boolean;
    autocomplete?: boolean;
    select?: boolean;
    options?: SelectOption[];
    fetchSuggestions?: AutocompleteFetchSuggestions;
    triggerOnFocus?: boolean;
    autoFocus?: boolean;
  }>(),
  {
    triggerOnFocus: true,
    autoFocus: true,
  }
);

const emit = defineEmits<{
  (e: 'change', val: string): void;
  (e: 'edit', val: boolean): void;
}>();

const t = translate;

const inputRef = ref<typeof ElInput | null>(null);

const internalValue = ref<string>(props.modelValue || '');
watch(
  () => props.modelValue,
  val => {
    if (internalValue.value) return;
    internalValue.value = val || '';
  }
);

const hasError = computed(() => {
  return props.required && !internalValue.value;
});

const onEdit = () => {
  emit('edit', true);
};
const focusInput = () => {
  if (!props.isEdit) return;
  if (!props.autoFocus) return;
  inputRef.value?.focus();
};
onMounted(focusInput);
watch(() => props.isEdit, focusInput);

const onCheck = () => {
  emit('edit', false);
  if (internalValue.value === props.modelValue) return;
  emit('change', internalValue.value);
};

const onSelect = (item: SelectOption) => {
  internalValue.value = item.value;
  onCheck();
};

const onCancel = () => {
  emit('edit', false);
  internalValue.value = props.modelValue || '';
};

const CellActions = () => (
  <div class="cell-actions">
    <ClIcon
      icon={['fa', 'check']}
      onClick={(event: MouseEvent) => {
        event.stopPropagation();
        if (hasError.value) return;
        onCheck();
      }}
    />
    <ClIcon
      icon={['fa', 'times']}
      onClick={(event: MouseEvent) => {
        event.stopPropagation();
        onCancel();
      }}
    />
  </div>
);

defineOptions({ name: 'ClTableEditCell' });
</script>

<template>
  <div
    class="table-edit-cell"
    :class="
      [
        isEdit ? 'is-edit' : '',
        required ? 'required' : '',
        hasError ? 'error' : '',
      ].join(' ')
    "
  >
    <template v-if="!isEdit">
      <span class="display-value" @click.stop="onEdit">
        <template v-if="modelValue">
          <template v-if="$slots.default">
            <slot name="default" />
          </template>
          <template v-else>
            {{ modelValue }}
          </template>
        </template>
        <template v-else>
          <span class="empty"> ({{ t('common.placeholder.empty') }}) </span>
        </template>
      </span>
    </template>
    <template v-else>
      <el-autocomplete
        v-if="autocomplete"
        ref="inputRef"
        v-model="internalValue"
        class="edit-input"
        size="default"
        :trigger-on-focus="triggerOnFocus"
        :fetch-suggestions="fetchSuggestions"
        :autofocus="autoFocus"
        @keyup.enter="onCheck"
        @select="onSelect"
      >
        <template #suffix>
          <cell-actions />
        </template>
      </el-autocomplete>
      <el-select
        v-else-if="select"
        ref="inputRef"
        v-model="internalValue"
        class="edit-input"
        size="default"
        @change="onCheck"
      >
        <el-option
          v-for="(op, $index) in options"
          :key="$index"
          :value="op.value"
          :label="op.label"
        />
      </el-select>
      <el-input
        v-else
        ref="inputRef"
        v-model="internalValue"
        class="edit-input"
        size="default"
        :autofocus="autoFocus"
        @keyup.enter="onCheck"
      >
        <template #suffix>
          <cell-actions />
        </template>
      </el-input>
    </template>
    <div class="cell-actions">
      <cl-icon v-if="!isEdit" :icon="['fa', 'edit']" @click.stop="onEdit" />
    </div>
  </div>
</template>

<style scoped>
.table-edit-cell {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;

  .display-value {
    margin: 0 12px;

    &:hover {
      cursor: pointer;
      color: var(--cl-primary-color);
      text-decoration: underline;
    }

    .empty {
      color: var(--el-text-color-secondary);
      font-style: italic;
    }
  }

  &:deep(.edit-input) {
    width: 100%;
    height: 100%;
  }

  &:deep(.el-input),
  &:deep(.edit-input .el-input__inner),
  &:deep(.edit-input .el-select__wrapper) {
    height: 100%;
  }

  &:deep(.el-input .el-input__wrapper),
  &:deep(.el-select .el-select__wrapper) {
    border-radius: 0;
    box-shadow: none;
  }

  &.is-edit {
    &:deep(.el-input .el-input__wrapper),
    &:deep(.el-select .el-select__wrapper) {
      border: 1px solid var(--cl-primary-color);
    }
  }

  &.error {
    border: 1px solid var(--cl-danger-color);

    &:deep(.el-input .el-input__wrapper),
    &:deep(.el-select .el-select__wrapper) {
      border: none;
    }
  }

  .cell-actions {
    display: none;
    position: absolute;
    right: 5px;
    height: 100%;
    align-items: center;

    &:deep(.icon) {
      cursor: pointer;
      padding: 5px;
      width: 14px;
      height: 14px;
    }

    &:deep(.icon:hover) {
      color: var(--cl-primary-color);
      border-radius: 50%;
      background-color: var(--cl-primary-plain-color);
    }
  }

  &.is-edit,
  &:hover {
    .cell-actions {
      display: flex;
    }
  }
}
</style>
