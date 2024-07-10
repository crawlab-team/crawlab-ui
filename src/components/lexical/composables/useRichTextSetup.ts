import type { LexicalEditor } from 'lexical';
import { registerRichText } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import useMounted from './useLexicalMounted';

export default (editor: LexicalEditor) => {
  useMounted(() => {
    return mergeRegister(registerRichText(editor));
  });
};
