<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClickOutside as vClickOutside } from 'element-plus';
import { LexicalEditor } from 'lexical';

const props = defineProps<{
  visible?: boolean;
  editor: LexicalEditor;
  toolbarRef: HTMLDivElement | null;
  buttonRef: HTMLButtonElement | null;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'insertTable'): void;
  (e: 'insertImage'): void;
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

function handle(event: Event) {
  const target = event.target as any;

  if (
    !dropDownRef.value?.contains(target) &&
    !props.toolbarRef?.contains(target)
  )
    emit('hide');
}

onMounted(() => {
  if (props.toolbarRef && dropDownRef.value)
    document.addEventListener('click', handle);
});

onUnmounted(() => {
  document.removeEventListener('click', handle);
});

const insertTable = () => {
  emit('hide');
  emit('insertTable');
};

const insertImage = () => {
  emit('hide');
  emit('insertImage');
};

const options: InsertOption[] = [
  { type: 'table', label: 'Table', onClick: insertTable },
  { type: 'image', label: 'Image', onClick: insertImage, disabled: true },
];

const onClickOutside = (event: Event) => {
  event.stopPropagation();
  emit('hide');
};

defineOptions({ name: 'ClInsertOptionsDropdownList' });
</script>

<template>
  <div v-click-outside="onClickOutside" ref="dropDownRef" class="dropdown">
    <button
      v-for="option in options"
      :key="option.type"
      class="item"
      :disabled="option.disabled"
      @click="option.onClick"
    >
      <span :class="`icon ${option.type}`" />
      <span class="text">{{ option.label }}</span>
    </button>
  </div>
</template>
