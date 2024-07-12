import type { LexicalEditor } from 'lexical';
import { registerRichText } from '@lexical/rich-text';
import useMounted from './useLexicalMounted';

export default (editor: LexicalEditor) => {
  useMounted(() => {
    return registerRichText(editor);
  });
};
