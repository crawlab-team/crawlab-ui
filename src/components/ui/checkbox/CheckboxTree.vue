<script setup lang="ts">
import { onBeforeMount, provide, ref, watch } from 'vue';

const modelValue = defineModel<any[]>();

const props = defineProps<{
  options: CheckboxTreeSelectOption[];
  disabled?: boolean;
  checkedAll?: boolean;
}>();

const emit = defineEmits<{
  (e: 'change', value: any[]): void;
}>();

// Internal state management
const internalState = ref(
  new Map<any, { checked: boolean; intermediate: boolean }>()
);

// Initialize or update internal state
const initializeState = (options: CheckboxTreeSelectOption[]) => {
  options.forEach(option => {
    if (!internalState.value.has(option.id)) {
      internalState.value.set(option.id, {
        checked:
          props.checkedAll ||
          modelValue.value?.includes(option.value) ||
          !!option.checked,
        intermediate: false,
      });
    }
    if (option.children?.length) {
      initializeState(option.children);
    }
  });
  // Update parent states after initializing all nodes
  updateParentStates(options);
};

// Get state for a specific option
const getState = (id: any) => {
  return internalState.value.get(id) || { checked: false, intermediate: false };
};

// Update parent checkbox states based on children
const updateParentStates = (options: CheckboxTreeSelectOption[]) => {
  options.forEach(option => {
    if (option.children?.length) {
      // First update children's states recursively
      updateParentStates(option.children);

      // Then calculate this parent's state based on all descendants
      const allDescendantStates: boolean[] = [];
      const collectDescendantStates = (opts: CheckboxTreeSelectOption[]) => {
        opts.forEach(opt => {
          if (!opt.children?.length) {
            // Only collect leaf node states
            allDescendantStates.push(getState(opt.id).checked);
          }
          if (opt.children?.length) {
            collectDescendantStates(opt.children);
          }
        });
      };
      collectDescendantStates(option.children);

      const checkedDescendants = allDescendantStates.filter(state => state);

      internalState.value.set(option.id, {
        checked: checkedDescendants.length === allDescendantStates.length,
        intermediate:
          checkedDescendants.length > 0 &&
          checkedDescendants.length < allDescendantStates.length,
      });
    }
  });
};

// Update model value when checkboxes change
const updateModelValue = () => {
  const values: any[] = [];
  const collectValues = (options: CheckboxTreeSelectOption[]) => {
    options.forEach(option => {
      const state = getState(option.id);
      if (state.checked && !option.children?.length) {
        values.push(option.value);
      }
      if (option.children?.length) {
        collectValues(option.children);
      }
    });
  };
  collectValues(props.options);
  modelValue.value = values;
  emit('change', values);
};

// Update children states recursively
const updateChildrenStates = (
  option: CheckboxTreeSelectOption,
  checked: boolean
) => {
  if (!option.children) return;

  option.children.forEach(child => {
    internalState.value.set(child.id, { checked, intermediate: false });
    if (child.children) {
      updateChildrenStates(child, checked);
    }
  });
};

// Find parent option recursively
const findParentOption = (
  options: CheckboxTreeSelectOption[],
  targetId: any
): CheckboxTreeSelectOption | null => {
  for (const option of options) {
    if (option.children?.some(child => child.id === targetId)) {
      return option;
    }
    if (option.children) {
      const parent = findParentOption(option.children, targetId);
      if (parent) return parent;
    }
  }
  return null;
};

// Update state and trigger necessary updates
const updateState = (
  id: any,
  checked: boolean,
  option: CheckboxTreeSelectOption
) => {
  internalState.value.set(id, { checked, intermediate: false });

  // Update all children when parent is clicked
  updateChildrenStates(option, checked);

  // Find and update all parent states up to root
  let currentOption = option;
  while (true) {
    const parent = findParentOption(props.options, currentOption.id);
    if (!parent) break;

    const siblings = parent.children || [];
    const siblingStates = siblings.map(sib => getState(sib.id));
    const checkedSiblings = siblingStates.filter(state => state.checked);

    internalState.value.set(parent.id, {
      checked: checkedSiblings.length === siblings.length,
      intermediate:
        checkedSiblings.length > 0 && checkedSiblings.length < siblings.length,
    });

    currentOption = parent;
  }

  updateModelValue();
};

// Check or uncheck all options
const checkAll = (checked: boolean) => {
  props.options.forEach(option => {
    updateState(option.id, checked, option);
  });
  updateParentStates(props.options);
};

// Provide shared state and methods
provide('checkboxTree', {
  internalState,
  getState,
  updateState,
  updateParentStates,
  options: props.options,
  disabled: props.disabled,
  checkedAll: props.checkedAll,
});

// Watch for changes in options
watch(
  () => props.options,
  () => {
    initializeState(props.options);
    updateParentStates(props.options);
    updateModelValue();
  },
  { deep: true }
);

onBeforeMount(() => {
  initializeState(props.options);
});

// Add this new method to check if all options are selected
const getCheckAllStatus = (): CheckboxStatus => {
  const allStates: boolean[] = [];
  const collectStates = (options: CheckboxTreeSelectOption[]) => {
    options.forEach(option => {
      if (!option.children?.length) {
        // Only collect leaf node states
        allStates.push(getState(option.id).checked);
      }
      if (option.children?.length) {
        collectStates(option.children);
      }
    });
  };
  collectStates(props.options);
  if (allStates.every(state => state)) {
    return 'checked';
  } else if (allStates.some(state => state)) {
    return 'indeterminate';
  } else {
    return 'unchecked';
  }
};

// Expose the method for parent components to use
defineExpose({
  getCheckAllStatus,
  checkAll,
});

defineOptions({ name: 'ClCheckboxTree' });
</script>

<template>
  <div class="checkbox-tree">
    <div class="checkbox-tree-group-wrapper" v-for="op in options" :key="op.id">
      <cl-checkbox-tree-group
        :option="op"
        :state="getState(op.id)"
        :disabled="disabled"
        :checked-all="checkedAll"
        @update:state="(checked: boolean) => updateState(op.id, checked, op)"
      />
    </div>
  </div>
</template>

<style scoped>
.checkbox-tree-group-wrapper {
  border-bottom: 1px solid var(--el-border-color);
  padding: 10px 0;
}
</style>
