<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { debounce } from 'lodash';
import { ClickOutside as vClickOutside } from 'element-plus';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import type {
  CommandListenerPriority,
  LexicalEditor,
  RangeSelection,
} from 'lexical';
import { $getSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import getSelectedNode from '../utils/getSelectedNode';
import { plainClone, translate } from '@/utils';
import ClForm from '@/components/ui/form/Form.vue';
import { matchers } from '@/components/ui/lexical/utils/autoLink';

const props = defineProps<{
  editor: LexicalEditor;
  priority: CommandListenerPriority;
}>();

const t = translate;

const visible = ref(false);
const editorRef = ref<HTMLDivElement | null>(null);
const formRef = ref<typeof ClForm>(null);
const formRules = ref<FormRules>({
  text: [
    {
      required: true,
      message: t('components.lexical.link.validate.textEmpty'),
    },
  ],
  url: [
    { required: true, message: t('components.lexical.link.validate.urlEmpty') },
    {
      validator: (rule, value) => {
        return matchers.some(matcher => {
          return !!matcher(value);
        });
      },
      message: t('components.lexical.link.validate.urlInvalid'),
    },
  ],
});

interface LinkForm {
  text: string;
  url: string;
}

const originalLinkForm = ref<LinkForm>({
  text: '',
  url: '',
});
const linkForm = ref<LinkForm>({
  text: '',
  url: '',
});
let selection: RangeSelection | null = null;
const lastSelection = ref<RangeSelection | null>(null);
const isConfirm = ref(false);

const positionEditorElement = (
  editor: HTMLDivElement,
  rect: DOMRect | null
) => {
  if (!rect) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.scrollY + 10}px`;
    editor.style.left = `${
      rect.left + window.scrollX - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
};

const showLinkEditor = debounce(() => {
  if (isConfirm.value) return;
  const { editor } = props;
  if (!editorRef.value) return;
  const nativeSelection = window.getSelection();
  const domRange = nativeSelection?.getRangeAt(0);
  const rootElement = editor.getRootElement();
  if (
    !rootElement?.contains(nativeSelection!.anchorNode) ||
    !editor.isEditable()
  ) {
    return;
  }
  let rect;
  if (nativeSelection?.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild) {
      inner = inner.firstElementChild as HTMLElement;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange!.getBoundingClientRect();
  }
  positionEditorElement(editorRef.value, rect);
  lastSelection.value = selection;
  visible.value = true;
}, 200);

const hideLinkEditor = debounce(() => {
  if (!editorRef.value) return;
  positionEditorElement(editorRef.value, null);
  visible.value = false;
}, 100);

const resetLinkEditor = () => {
  hideLinkEditor();
  lastSelection.value = null;
  linkForm.value = {
    url: '',
    text: '',
  };
  originalLinkForm.value = plainClone(linkForm.value);
};

const updateLinkEditor = () => {
  selection = $getSelection() as RangeSelection;
  if (!selection) {
    resetLinkEditor();
    return;
  }

  const node = getSelectedNode(selection);
  const linkParent = $findMatchingParent(node, $isLinkNode);
  if (!linkParent && !$isLinkNode(node)) {
    resetLinkEditor();
    return;
  }

  linkForm.value = {
    text: linkParent?.getTextContent().trim() || '',
    url: linkParent?.getURL()?.trim() || '',
  };
  originalLinkForm.value = plainClone(linkForm.value);
  showLinkEditor();

  return true;
};

let unregisterListener: () => void;

onMounted(() => {
  const { editor } = props;
  unregisterListener = mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateLinkEditor();
      });
    }),

    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateLinkEditor();
        return false;
      },
      props.priority
    )
  );
});

onMounted(() => {
  const { editor } = props;
  editor.getEditorState().read(() => {
    updateLinkEditor();
  });
});

onUnmounted(() => {
  unregisterListener?.();
});

const onCancel = () => {
  resetLinkEditor();
};

const onUnlink = () => {
  const { editor } = props;
  editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  resetLinkEditor();
};

const onConfirm = async () => {
  await formRef.value?.validate();
  isConfirm.value = true;
  setTimeout(() => {
    isConfirm.value = false;
  }, 500);
  const { editor } = props;
  const { url, text } = linkForm.value;
  selection = lastSelection.value;
  editor.update(() => {
    const node = getSelectedNode(selection);
    const linkParent = $findMatchingParent(node, $isLinkNode);
    if (text !== originalLinkForm.value.text) {
      linkParent.getAllTextNodes().forEach(textNode => {
        textNode.setTextContent(text);
      });
    }
    if (url !== originalLinkForm.value.url) {
      linkParent.setURL(url);
    }
  });
  resetLinkEditor();
};

const onGoTo = () => {
  window.open(linkForm.value.url, '_blank');
  resetLinkEditor();
};

defineOptions({ name: 'ClFloatLinkEditor' });
</script>

<template>
  <div
    v-show="visible"
    v-click-outside="() => (visible = false)"
    ref="editorRef"
    class="link-editor"
  >
    <cl-form
      ref="formRef"
      :model="linkForm"
      :rules="formRules"
      label-width="100px"
    >
      <cl-form-item
        :span="4"
        :label="t('components.lexical.link.text')"
        prop="text"
        required
      >
        <el-input v-model="linkForm.text" @keyup.enter="onConfirm" />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('components.lexical.link.url')"
        prop="url"
        required
      >
        <el-input v-model="linkForm.url" @keyup.enter="onConfirm" />
      </cl-form-item>
    </cl-form>
    <div class="actions">
      <div>
        <cl-label-button
          type="primary"
          :icon="['fa', 'paper-plane']"
          :label="t('common.actions.goto')"
          @click="onGoTo"
        />
      </div>
      <div>
        <cl-button type="info" plain @click="onCancel">
          {{ t('common.actions.cancel') }}
        </cl-button>
        <cl-button
          v-if="!matchers.some(matcher => matcher(originalLinkForm.text))"
          type="danger"
          plain
          @click="onUnlink"
        >
          {{ t('common.actions.unlink') }}
        </cl-button>
        <cl-button type="primary" @click="onConfirm">
          {{ t('common.actions.confirm') }}
        </cl-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-editor {
  padding: 20px;
  min-width: 560px;

  .actions {
    margin-top: 20px;
    text-align: right;
    display: flex;
    justify-content: space-between;
  }

  &:deep(.form-item:last-child .el-form-item) {
    margin-bottom: 0;
  }

  &:deep(.button-wrapper:not(:first-child)) {
    margin-left: 10px;
  }

  &:deep(.button-wrapper) {
    margin-right: 0;
  }
}
</style>
<style scoped></style>
