<script setup lang="ts">
import { computed, ref } from 'vue';

const modelValue = defineModel();

const props = defineProps<{
  options: SelectOption[];
}>();

const emit = defineEmits<{
  (e: 'select', value: string): void;
}>();

const visible = ref(false);

const icon = computed<Icon | undefined>(() => {
  const { options } = props;
  return options.find(option => option.value === modelValue.value)?.icon;
});

defineOptions({ name: 'ClDropdownButton' });
</script>

<template>
  <el-dropdown trigger="click">
    <button
      class="toolbar-item block-controls"
      aria-label="Formatting Options"
      @click="visible = !visible"
    >
      <span v-if="Array.isArray(icon)" class="icon">
        <cl-icon :icon="icon" />
      </span>
      <span v-else :class="`icon block-type ${icon || modelValue}`" />
      <i class="chevron-down" />
    </button>
    <template #dropdown>
      <el-dropdown-item
        v-for="op in options"
        :key="op.value"
        @click="emit('select', op.value)"
      >
        <span v-if="Array.isArray(op.icon)" class="icon">
          <cl-icon :icon="op.icon" />
        </span>
        <span v-else :class="`icon block-type ${op.icon || op.value}`" />
        <span>{{ op.label }}</span>
      </el-dropdown-item>
    </template>
  </el-dropdown>
</template>
