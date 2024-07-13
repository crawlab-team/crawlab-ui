<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClickOutside as vClickOutside } from 'element-plus';
import { LexicalEditor } from 'lexical';
import { translate } from '@/utils';

const props = defineProps<{
  visible?: boolean;
  editor: LexicalEditor;
  toolbarRef: HTMLDivElement | null;
  buttonRef: HTMLButtonElement | null;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'insertVariable'): void;
  (e: 'insertTable'): void;
  (e: 'insertImage'): void;
}>();

const t = translate;

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

const insertVariable = () => {
  emit('hide');
  emit('insertVariable');
};

const insertTable = () => {
  emit('hide');
  emit('insertTable');
};

const insertImage = () => {
  emit('hide');
  emit('insertImage');
};

const options: InsertOption[] = [
  {
    type: 'variable',
    label: t('components.editor.models.variable'),
    onClick: insertVariable,
    icon: ['fa', 'dollar'],
  },
  {
    type: 'table',
    label: t('components.editor.models.table'),
    onClick: insertTable,
  },
  {
    type: 'image',
    label: t('components.editor.models.image'),
    onClick: insertImage,
    disabled: true,
  },
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
      <span v-if="!option.icon" :class="`icon ${option.type}`" />
      <span v-else class="icon">
        <cl-icon :icon="option.icon" />
      </span>
      <span class="text">{{ option.label }}</span>
    </button>
  </div>
</template>
