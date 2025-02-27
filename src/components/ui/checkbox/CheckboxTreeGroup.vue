<script setup lang="ts">
import { computed, inject } from 'vue';

const props = defineProps<{
  option: CheckboxTreeSelectOption;
  state: {
    checked: boolean;
    intermediate: boolean;
  };
  disabled?: boolean;
  checkedAll?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:state', checked: boolean): void;
}>();

// Inject shared state and methods
const {
  getState,
  updateState,
  disabled: globalDisabled,
  checkedAll: globalCheckedAll,
} = inject('checkboxTree') as {
  getState: (id: string) => { checked: boolean; intermediate: boolean };
  updateState: (
    id: string,
    checked: boolean,
    option: CheckboxTreeSelectOption
  ) => void;
  disabled?: boolean;
  checkedAll?: boolean;
};

// Compute final disabled state (either global or individual)
const isDisabled = computed(() => globalDisabled || props.disabled);

// Handle checkbox changes
const onChange = (checked: boolean) => {
  emit('update:state', checked);
};

// Compute child padding based on nesting level
const childPadding = computed(() => {
  return props.option.children ? '20px' : '0';
});

defineOptions({ name: 'ClCheckboxTreeGroup' });
</script>

<template>
  <div class="checkbox-tree" :class="option.horizontal ? 'horizontal' : ''">
    <el-checkbox
      :model-value="state.checked"
      class="checkbox-item"
      :indeterminate="state.intermediate"
      :disabled="isDisabled"
      @update:model-value="onChange"
    >
      <span class="icon-wrapper" v-if="option.icon">
        <cl-icon :icon="option.icon" />
      </span>
      <span class="label" :style="{ width: option.labelWidth }">
        {{ option.label }}
      </span>
    </el-checkbox>

    <div
      class="children"
      v-if="option.children"
      :style="{ paddingLeft: childPadding }"
    >
      <cl-checkbox-tree-group
        v-for="op in option.children"
        :key="op.id"
        :option="op"
        :state="getState(op.id!)"
        :disabled="isDisabled"
        :checked-all="checkedAll"
        @update:state="(checked: boolean) => updateState(op.id!, checked, op)"
      />
    </div>
  </div>
</template>

<style scoped>
.checkbox-tree {
  display: flex;
  flex-direction: column;

  &.horizontal {
    & > .children {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .checkbox-item {
    margin-right: 30px;
    flex: 0 0 auto;

    .icon-wrapper {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      margin-right: 5px;
    }

    .label {
      display: inline-block;
      min-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .children {
    width: 100%;
  }
}
</style>
