<script setup lang="tsx">
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { ref } from 'vue';
import {
  $isImageNode,
  RIGHT_CLICK_IMAGE_COMMAND,
} from '@/components/ui/lexical/nodes/ImageNode';
import brokenImage from '@/assets/lexical/images/image-broken.svg';
import useEffect from '../composables/useLexicalEffect';
import { mergeRegister } from '@lexical/utils';

const props = defineProps<{
  editor: LexicalEditor;
  altText: string;
  caption: LexicalEditor;
  height: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: 'inherit' | number;
  captionsEnabled: boolean;
}>();

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
      img.onerror = () => {
        imageCache.add(src);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  onError,
}: {
  altText: string;
  className: string | null;
  height: 'inherit' | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: 'inherit' | number;
  onError: () => void;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width,
      }}
      onError={onError}
      draggable="false"
    />
  );
}

function BrokenImage(): JSX.Element {
  return (
    <img
      src={brokenImage}
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
      draggable="false"
    />
  );
}

const imageRef = ref<HTMLImageElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);
const isSelected = ref(false);
const isResizing = ref(false);
const selection = ref<BaseSelection | null>(null);
const activeEditorRef = ref<LexicalEditor | null>(null);
const isLoadError = ref(false);

const $onDelete = (payload: KeyboardEvent) => {
  if (isSelected && $isNodeSelection($getSelection())) {
    payload.preventDefault();
    const node = $getNodeByKey(nodeKey);
    if ($isImageNode(node)) {
      node.remove();
      return true;
    }
  }
  return false;
};

const $onEnter = (event: KeyboardEvent) => {
  const { showCaption, caption } = props;
  const latestSelection = $getSelection();
  const buttonElem = buttonRef.value;
  if (
    isSelected &&
    $isNodeSelection(latestSelection) &&
    latestSelection.getNodes().length === 1
  ) {
    if (showCaption) {
      // Move focus into nested editor
      $setSelection(null);
      event.preventDefault();
      caption.focus();
      return true;
    } else if (buttonElem !== null && buttonElem !== document.activeElement) {
      event.preventDefault();
      buttonElem.focus();
      return true;
    }
  }
  return false;
};

const $onEscape = (event: KeyboardEvent) => {
  const { editor, caption } = props;
  if (activeEditorRef.value === caption || buttonRef.value === event.target) {
    $setSelection(null);
    editor.update(() => {
      isSelected.value = true;
      const parentRootElement = editor.getRootElement();
      if (parentRootElement) {
        parentRootElement.focus();
      }
    });
    return true;
  }
  return false;
};

const onClick = (payload: MouseEvent) => {
  const event = payload;

  if (isResizing) {
    return true;
  }
  if (event.target === imageRef.value) {
    if (event.shiftKey) {
      isSelected.value = !isSelected;
    } else {
      isSelected.value = true;
    }
    return true;
  }

  return false;
};

const onRightClick = (event: MouseEvent): void => {
  const { editor } = props;
  editor.getEditorState().read(() => {
    const latestSelection = $getSelection();
    const domElement = event.target as HTMLElement;
    if (
      domElement.tagName === 'IMG' &&
      $isRangeSelection(latestSelection) &&
      latestSelection.getNodes().length === 1
    ) {
      editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent);
    }
  });
};

useEffect(() => {
  const { editor } = props;
  let isMounted = true;
  const rootElement = editor.getRootElement();
  const unregister = mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      if (isMounted) {
        selection.value = editorState.read(() => $getSelection());
      }
    }),
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_, activeEditor) => {
        activeEditorRef.value = activeEditor;
        return false;
      },
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
    editor.registerCommand(
      RIGHT_CLICK_IMAGE_COMMAND,
      onClick,
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(
      DRAGSTART_COMMAND,
      event => {
        if (event.target === imageRef.value) {
          // TODO This is just a temporary workaround for FF to behave like other browsers.
          // Ideally, this handles drag & drop too (and all browsers).
          event.preventDefault();
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(KEY_DELETE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
    editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      $onDelete,
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
    editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW)
  );

  rootElement?.addEventListener('contextmenu', onRightClick);

  return () => {
    isMounted = false;
    unregister();
    rootElement?.removeEventListener('contextmenu', onRightClick);
  };
});

const setShowCaption = () => {
  const { editor } = props;
  editor.update(() => {
    const node = $getNodeByKey(nodeKey);
    if ($isImageNode(node)) {
      node.setShowCaption(true);
    }
  });
};

const onResizeEnd = (
  nextWidth: 'inherit' | number,
  nextHeight: 'inherit' | number
) => {
  const { editor } = props;
  // Delay hiding the resize bars for click case
  setTimeout(() => {
    isResizing.value = false;
  }, 200);

  editor.update(() => {
    const node = $getNodeByKey(nodeKey);
    if ($isImageNode(node)) {
      node.setWidthAndHeight(nextWidth, nextHeight);
    }
  });
};

const onResizeStart = () => {
  isResizing.value = true;
};

const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
const isFocused = isSelected || isResizing;
</script>

<template>
  <Suspense>
    <div :draggable="draggable">
      <BrokenImage v-if="isLoadError" />
      <LazyImage
        :class="
          isFocused
            ? `focused ${$isNodeSelection(selection)}`
              ? 'draggable'
              : ''
            : null
        "
        :src="src"
        :altText="altText"
        :imageRef="imageRef"
        :width="width"
        :height="height"
        :maxWidth="maxWidth"
        :onError="
          () => {
            isLoadError.value = true;
          }
        "
      />
    </div>
  </Suspense>
</template>
