<script setup lang="tsx">
import { computed, onMounted, ref, watch } from 'vue';
import {
  ElInput,
  ElAutocomplete,
  type AutocompleteFetchSuggestions,
} from 'element-plus';
import dayjs from 'dayjs';
import JsonEditorVue from 'json-editor-vue';
import { ClIcon } from '@/components';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    isEdit?: boolean;
    required?: boolean;
    autocomplete?: boolean;
    select?: boolean;
    options?: SelectOption[];
    fetchSuggestions?: AutocompleteFetchSuggestions;
    triggerOnFocus?: boolean;
    autoFocus?: boolean;
    automaticDropdown?: boolean;
    dataType?: DatabaseDataType;
    readonly?: boolean;
  }>(),
  {
    triggerOnFocus: true,
    autoFocus: true,
    automaticDropdown: true,
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
  const { required, dataType } = props;
  if (required && !internalValue.value) {
    return true;
  }
  if (
    dataType === 'objectid' &&
    internalValue.value &&
    !/^([0-9]|[a-f]){24}$/i.test(internalValue.value)
  ) {
    return true;
  }
  return false;
});

const onEdit = () => {
  emit('edit', true);
};
const focusInput = () => {
  if (!props.isEdit) return;
  if (!props.autoFocus) return;
  inputRef.value?.focus?.();
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

const labelValue = computed<string>(() => {
  const { modelValue, dataType } = props;
  if (modelValue === null || modelValue === undefined) return '';
  switch (dataType) {
    case 'number':
      return modelValue;
    case 'boolean':
      return modelValue ? t('common.boolean.true') : t('common.boolean.false');
    case 'string':
      return modelValue;
    case 'datetime':
      return dayjs(modelValue).format('YYYY-MM-DD HH:mm:ss');
    case 'date':
      return dayjs(modelValue).format('YYYY-MM-DD');
    case 'object':
    case 'array':
      return JSON.stringify(props.modelValue);
    case 'objectid':
      return modelValue;
    default:
      return modelValue;
  }
});

const isJson = computed(() => {
  return ['object', 'array'].includes(props.dataType || '');
});

const dialogVisible = ref(false);

const onView = () => {
  dialogVisible.value = true;
};

const onHide = () => {
  dialogVisible.value = false;
};

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
    <template v-if="!isEdit || isJson || readonly">
      <span
        class="display-value"
        @click.stop="() => (!readonly ? onEdit() : onView())"
        :title="labelValue"
      >
        <template v-if="modelValue">
          <template v-if="$slots.default">
            <slot name="default" />
          </template>
          <template v-else>
            {{ labelValue }}
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
      />
      <el-select
        v-else-if="select"
        ref="inputRef"
        v-model="internalValue"
        class="edit-input"
        size="default"
        :autofocus="autoFocus"
        :automatic-dropdown="automaticDropdown"
        @change="onCheck"
        @blur="onCancel"
      >
        <el-option
          v-for="(op, $index) in options"
          :key="$index"
          :value="op.value"
          :label="op.label"
        />
      </el-select>
      <template v-else>
        <el-date-picker
          v-if="dataType === 'date'"
          ref="inputRef"
          v-model="internalValue"
          class="edit-input"
          size="default"
          type="date"
          value-format="YYYY-MM-DD"
          @keyup.enter="onCheck"
          @change="onCheck"
          @blur="onCancel"
        />
        <el-date-picker
          v-else-if="dataType === 'datetime'"
          ref="inputRef"
          v-model="internalValue"
          class="edit-input"
          size="default"
          type="datetime"
          value-format="YYYY-MM-DD hh:mm:ss"
          @keyup.enter="onCheck"
          @change="onCheck"
          @visible-change="(visible: boolean) => {
            if (!visible) {
              onCheck();
            }
          }"
        />
        <el-input
          v-else-if="dataType === 'number'"
          ref="inputRef"
          v-model="internalValue"
          class="edit-input"
          size="default"
          :autofocus="autoFocus"
          type="number"
          @keyup.enter="onCheck"
        />
        <el-checkbox
          v-else-if="dataType === 'boolean'"
          ref="inputRef"
          v-model="internalValue"
          class="edit-input"
          size="default"
          :label="
            internalValue ? t('common.boolean.true') : t('common.boolean.false')
          "
        />
        <el-input
          v-else-if="dataType === 'objectid'"
          ref="inputRef"
          v-model="internalValue"
          class="edit-input"
          size="default"
          :autofocus="autoFocus"
          @keyup.enter="onCheck"
        />
        <el-input
          v-else
          ref="inputRef"
          v-model="internalValue"
          class="edit-input"
          size="default"
          :autofocus="autoFocus"
          @keyup.enter="onCheck"
        />
      </template>
    </template>
    <div v-if="!readonly" class="cell-actions">
      <cl-icon v-if="!isEdit" :icon="['fa', 'edit']" @click.stop="onEdit" />
      <cell-actions
        v-else-if="!['date', 'datetime'].includes(dataType || '')"
      />
    </div>
  </div>

  <template
    v-if="
      (dialogVisible || isEdit) &&
      dataType &&
      ['object', 'array'].includes(dataType)
    "
  >
    <cl-dialog
      :visible="dialogVisible || isEdit"
      append-to-body
      @confirm="() => (!readonly ? onCheck() : onHide())"
      @close="() => (!readonly ? onCancel() : onHide())"
    >
      <JsonEditorVue v-model="internalValue" />
    </cl-dialog>
  </template>
</template>

<style scoped>
.table-edit-cell {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;

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
