<script setup lang="ts">
defineProps<{
  label?: string;
  placeholder?: string;
  filterable?: boolean;
  popperClass?: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: any): void;
  (e: 'clear'): void;
}>();
defineOptions({ name: 'ClSelect' });
</script>

<template>
  <el-select
    v-model="internalModelValue"
    :placeholder="placeholder"
    :filterable="filterable"
    :popper-class="popperClass"
    @change="(value: any) => emit('change', value)"
    @clear="() => emit('clear')"
  >
    <slot />
    <template #label>
      <slot name="label" />
    </template>
  </el-select>
</template>
