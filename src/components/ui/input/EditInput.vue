<script setup lang="tsx">
import { computed, onMounted, ref, watch } from 'vue';
import { ElInput } from 'element-plus';
import { ClIcon } from '@/components';
import { translate } from '@/utils';
import { debounce } from 'lodash';

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    initialEditState?: boolean;
    required?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    readonly?: boolean;
    inputType?: string;
    height?: number | string;
    displayValue?: string;
  }>(),
  {
    autoFocus: true,
    inputType: 'text',
    initialEditState: false,
    height: 32,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void;
  (e: 'change', val: any): void;
  (e: 'edit', val: boolean): void;
}>();

const t = translate;

const inputRef = ref();
const isEdit = ref(props.initialEditState);

// Helper function to determine if a value should be considered empty
const isEmpty = (value: any): boolean => {
  return value === undefined || value === null || value === '';
};

// Convert null/undefined to empty string for display purposes
const normalizeValue = (value: any): string => {
  return isEmpty(value) ? '' : String(value);
};

const internalValue = ref(normalizeValue(props.modelValue));

watch(
  () => props.modelValue,
  val => {
    if (
      internalValue.value !== undefined &&
      internalValue.value === normalizeValue(val)
    )
      return;
    internalValue.value = normalizeValue(val);
  }
);

const hasError = computed(() => {
  // Error condition: required field is empty AND empty values are not allowed
  if (props.required && isEmpty(internalValue.value)) {
    return true;
  }
  return false;
});

// Function to check if we should display the empty placeholder
const shouldShowEmptyPlaceholder = computed(() => {
  return isEmpty(props.modelValue);
});

const onEdit = () => {
  if (props.readonly) return;
  isEdit.value = true;
  emit('edit', true);
};

const focusInput = debounce(() => {
  if (!isEdit.value) return;
  if (!props.autoFocus) return;
  inputRef.value?.focus?.();
});

onMounted(focusInput);
watch(() => isEdit.value, focusInput);

const onCheck = () => {
  // Don't allow saving if there's an error
  if (hasError.value) {
    return;
  }

  isEdit.value = false;
  emit('edit', false);

  // Only emit a change if the normalized values differ (emit the change)
  if (
    normalizeValue(internalValue.value) !== normalizeValue(props.modelValue)
  ) {
    emit('update:modelValue', internalValue.value);
    emit('change', internalValue.value);
  }
};

const onCancel = () => {
  isEdit.value = false;
  emit('edit', false);
  internalValue.value = normalizeValue(props.modelValue);
};

// Watch for external isEdit changes through the initialEditState prop
watch(
  () => props.initialEditState,
  newVal => {
    if (newVal !== isEdit.value) {
      isEdit.value = newVal;
    }
  }
);

const CellActions = () => (
  <div class="edit-actions">
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

const onEnterKeyDown = (event: Event | KeyboardEvent) => {
  // Prevent default action to avoid form submissions
  event.preventDefault();
};

const onBlur = () => {
  // Optionally auto-save on blur
  // Uncomment the line below if you want to save on blur
  // if (isEdit.value) onCheck();
};

defineOptions({ name: 'ClEditInput' });
</script>

<template>
  <div
    class="edit-input"
    :class="
      [
        isEdit ? 'is-edit' : '',
        required ? 'required' : '',
        hasError ? 'error' : '',
        readonly ? 'readonly' : '',
      ].join(' ')
    "
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <template v-if="!isEdit">
      <span class="display-value" @click.stop="onEdit" :title="modelValue">
        <template v-if="displayValue">
          {{ displayValue }}
        </template>
        <template v-else>
          <template v-if="!shouldShowEmptyPlaceholder">
            <template v-if="$slots.default">
              <slot name="default" />
            </template>
            <template v-else>
              {{ internalValue }}
            </template>
          </template>
          <template v-else>
            <span class="empty">
              ({{ placeholder || t('common.placeholder.empty') }})
            </span>
          </template>
        </template>
      </span>
    </template>
    <template v-else>
      <el-input
        ref="inputRef"
        v-model="internalValue"
        class="edit-input-field"
        size="default"
        :type="inputType"
        :autofocus="autoFocus"
        :placeholder="placeholder || t('common.placeholder.empty')"
        @keydown.enter.prevent="onEnterKeyDown"
        @keyup.enter.prevent="onCheck"
        @blur="onBlur"
      />
    </template>
    <div class="edit-actions">
      <cl-icon
        v-if="!isEdit && !readonly"
        :icon="['fa', 'edit']"
        @click.stop="onEdit"
      />
      <cell-actions v-else-if="isEdit" />
    </div>
  </div>
</template>

<style scoped>
.edit-input {
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  width: 100%;

  .display-value {
    margin: 0 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 24px);

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

  &:deep(.edit-input-field) {
    width: 100%;
    height: 100%;
  }

  &:deep(.el-input) {
    height: 100%;
  }

  &:deep(.el-input__wrapper) {
    height: 100%;
  }

  &:deep(.el-input__inner) {
    height: 100%;
  }

  &.readonly .display-value:hover {
    cursor: default;
    color: inherit;
    text-decoration: none;
  }

  .edit-actions {
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
    .edit-actions {
      display: flex;
    }
  }
}
</style>
