<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClickOutside as vClickOutside } from 'element-plus';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from 'lexical';
import { $wrapNodes } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { translate } from '@/utils';

const props = defineProps<{
  visible?: boolean;
  editor: LexicalEditor;
  toolbarRef: HTMLDivElement | null;
  buttonRef: HTMLButtonElement | null;
  blockType: BlockType;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
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

const formatParagraph = () => {
  const { editor } = props;
  if (props.blockType !== 'paragraph') {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection))
        $wrapNodes(selection, () => $createParagraphNode());
    });
  }
  emit('hide');
};

const formatH1 = () => {
  const { editor } = props;
  if (props.blockType !== 'h1') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode('h1'));
      }
    });
  }
  emit('hide');
};

const formatH2 = () => {
  const { editor } = props;
  if (props.blockType !== 'h2') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode('h2'));
      }
    });
  }
  emit('hide');
};

const formatH3 = () => {
  const { editor } = props;
  if (props.blockType !== 'h3') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode('h3'));
      }
    });
  }
  emit('hide');
};

const options: BlockOption[] = [
  {
    type: 'paragraph',
    label: t('components.editor.toolbar.block.paragraph'),
    onClick: formatParagraph,
  },
  {
    type: 'h1',
    label: t('components.editor.toolbar.block.h1'),
    onClick: formatH1,
  },
  {
    type: 'h2',
    label: t('components.editor.toolbar.block.h2'),
    onClick: formatH2,
  },
  {
    type: 'h3',
    label: t('components.editor.toolbar.block.h3'),
    onClick: formatH3,
  },
];

const onClickOutside = (event: Event) => {
  event.stopPropagation();
  emit('hide');
};

defineOptions({ name: 'ClBlockOptionsDropdownList' });
</script>

<template>
  <div v-click-outside="onClickOutside" ref="dropDownRef" class="dropdown">
    <button
      v-for="option in options"
      :key="option.type"
      class="item"
      :class="{ active: blockType === option.type }"
      @click="option.onClick"
    >
      <span :class="`icon ${option.type}`" />
      <span class="text">{{ option.label }}</span>
    </button>
  </div>
</template>
