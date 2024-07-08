<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClickOutside as vClickOutside } from 'element-plus';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $wrapNodes } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';

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

const formatBulletList = () => {
  const { editor } = props;
  if (props.blockType !== 'ul') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }

  emit('hide');
};

const formatNumberedList = () => {
  const { editor } = props;
  if (props.blockType !== 'ol') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }

  emit('hide');
};

const formatQuote = () => {
  const { editor } = props;
  if (props.blockType !== 'quote') {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createQuoteNode());
      }
    });
  }
  emit('hide');
};

const formatCode = () => {
  const { editor } = props;
  if (props.blockType !== 'code') {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
      }
    });
  }
  emit('hide');
};

const options: BlockOption[] = [
  { type: 'paragraph', label: 'Normal', onClick: formatParagraph },
  { type: 'h1', label: 'Heading 1', onClick: formatH1 },
  { type: 'h2', label: 'Heading 2', onClick: formatH2 },
  { type: 'h3', label: 'Heading 3', onClick: formatH3 },
  { type: 'ul', label: 'Bullet List', onClick: formatBulletList },
  { type: 'ol', label: 'Numbered List', onClick: formatNumberedList },
  { type: 'quote', label: 'Quote', onClick: formatQuote },
  { type: 'code', label: 'Code Block', onClick: formatCode },
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
