import { InsertTableCommandPayloadHeaders } from '@lexical/table';
import { LexicalEditor, NodeKey } from 'lexical';

export declare global {
  type BlockType =
    | 'root'
    | 'code'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'ol'
    | 'paragraph'
    | 'quote'
    | 'ul';

  interface BaseOption {
    label: string;
    disabled?: boolean;
    icon?: Icon;
    onClick: () => void;
  }

  interface BlockOption extends BaseOption {
    type: BlockType;
  }

  type InsertType = 'table' | 'image';

  interface InsertOption extends BaseOption {
    type: InsertType;
  }

  interface TableForm {
    rows: number;
    columns: number;
    includeHeaders?: InsertTableCommandPayloadHeaders;
  }

  interface InsertImageCommandPayload {
    src: string;
  }

  interface ImageForm {
    src: string;
  }

  interface ImagePayload {
    editor: LexicalEditor;
    altText: string;
    caption?: LexicalEditor;
    height?: number;
    key?: NodeKey;
    maxWidth?: number;
    showCaption?: boolean;
    src: string;
    width?: number;
    captionsEnabled?: boolean;
  }

  type InsertImagePayload = Readonly<ImagePayload>;

  interface VariableForm {
    name: string;
  }

  interface InsertVariableCommandPayload {
    name: string;
  }
}
