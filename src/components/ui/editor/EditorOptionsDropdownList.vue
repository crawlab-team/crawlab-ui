<script setup lang="ts">
import { ClickOutside as vClickOutside } from 'element-plus';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  visible?: boolean;
  options: EditorOption[];
  toolbarRef: HTMLDivElement | null;
  buttonRef: HTMLButtonElement | null;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
}>();

const dropDownRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const { toolbarRef, buttonRef } = props;
  if (toolbarRef && buttonRef && dropDownRef.value) {
    const { top, left } = buttonRef.getBoundingClientRect();
    dropDownRef.value.style.top = `${top + 40}px`;
    dropDownRef.value.style.left = `${left}px`;
  }
});

const onClickOutside = (event: Event) => {
  event.stopPropagation();
  emit('hide');
};
defineOptions({ name: 'ClEditorOptionsDropdownList' });
</script>

<template>
  <div v-click-outside="onClickOutside" ref="dropDownRef" class="dropdown">
    <button
      v-for="(option, $index) in options"
      :key="$index"
      class="item"
      @click="option.onClick"
    >
      <span class="icon">
        <cl-icon :icon="option.icon" />
      </span>
      <span class="text">{{ option.label }}</span>
    </button>
  </div>
</template>
