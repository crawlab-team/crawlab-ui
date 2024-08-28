<script setup lang="tsx">
import { ref, watch } from 'vue';
import {
  ElInput,
  ElAutocomplete,
  type AutocompleteFetchSuggestions,
} from 'element-plus';
import { ClIcon } from '@/components';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    required?: boolean;
    autocomplete?: boolean;
    fetchSuggestions?: AutocompleteFetchSuggestions;
    triggerOnFocus?: boolean;
  }>(),
  {
    triggerOnFocus: true,
  }
);

const emit = defineEmits<{
  (e: 'change', val: string): void;
}>();

const inputRef = ref<typeof ElInput | null>(null);

const internalValue = ref<string>(props.modelValue || '');
watch(
  () => props.modelValue,
  val => {
    internalValue.value = val || '';
  }
);

const isEdit = ref(false);

const onEdit = () => {
  isEdit.value = true;
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0);
};

const onCheck = () => {
  isEdit.value = false;
  if (internalValue.value === props.modelValue) return;
  emit('change', internalValue.value);
};

const onSelect = (item: SelectOption) => {
  internalValue.value = item.value;
  onCheck();
};

const onCancel = () => {
  isEdit.value = false;
  internalValue.value = props.modelValue || '';
};

const CellActions = () => (
  <div class="cell-actions">
    <ClIcon
      icon={['fa', 'check']}
      onClick={(event: MouseEvent) => {
        event.stopPropagation();
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
      [isEdit ? 'is-edit' : '', props.required ? 'required' : ''].join(' ')
    "
  >
    <template v-if="!isEdit">
      <span class="display-value" @click.stop="onEdit">
        {{ modelValue }}
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
        @keyup.enter="onCheck"
        @select="onSelect"
      >
        <template #suffix>
          <cell-actions />
        </template>
      </el-autocomplete>
      <el-input
        v-else
        ref="inputRef"
        v-model="internalValue"
        class="edit-input"
        size="default"
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
  height: 100%;

  .display-value {
    margin: 0 12px;

    &:hover {
      cursor: pointer;
      color: var(--cl-primary-color);
      text-decoration: underline;
    }
  }

  &:deep(.edit-input) {
    width: 100%;
    height: 100%;
  }

  &:deep(.el-input),
  &:deep(.edit-input .el-input__inner) {
    height: 100%;
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
