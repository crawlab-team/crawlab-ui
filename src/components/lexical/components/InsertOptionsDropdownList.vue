<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
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

const options: BlockOption[] = [
  { type: 'table', label: 'Table', onClick: insertTable },
];

defineOptions({ name: 'ClInsertOptionsDropdownList' });
</script>

<template>
  <div ref="dropDownRef" class="dropdown">
    <button class="item" @click="insertTable">
      <span class="icon table" />
      <span class="text">Table</span>
    </button>
  </div>
</template>
