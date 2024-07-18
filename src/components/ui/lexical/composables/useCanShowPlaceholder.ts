import { readonly, ref } from 'vue';
import type { LexicalEditor } from 'lexical';
import { $canShowPlaceholderCurry } from '@lexical/text';
import { mergeRegister } from '@lexical/utils';
import useMounted from './useLexicalMounted';

const canShowPlaceholderFromCurrentEditorState = (
  editor: LexicalEditor
): boolean => {
  return editor
    .getEditorState()
    .read($canShowPlaceholderCurry(editor.isComposing()));
};

export default (editor: LexicalEditor) => {
  const initialState = editor
    .getEditorState()
    .read($canShowPlaceholderCurry(editor.isComposing()));

  const canShowPlaceholder = ref(initialState);

  const resetCanShowPlaceholder = () => {
    canShowPlaceholder.value = canShowPlaceholderFromCurrentEditorState(editor);
  };

  useMounted(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        resetCanShowPlaceholder();
      }),
      editor.registerEditableListener(() => {
        resetCanShowPlaceholder();
      })
    );
  });

  return readonly(canShowPlaceholder);
};
