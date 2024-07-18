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

  type EditorOption = BaseOption;

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

  interface SetTableHeadCellWidthPayload {
    nodeKey: NodeKey;
    width: number;
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
    category?: NotificationVariableCategory;
    name: string;
  }

  interface InsertVariableCommandPayload {
    category?: NotificationVariableCategory;
    name: string;
  }

  interface UpdateVariableCommandPayload {
    nodeKey: NodeKey;
    action: 'select' | 'format';
    value?: any;
  }

  interface RichTextPayload {
    richTextContent: string;
    richTextContentJson: string;
  }

  interface ToolbarStates {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    left: boolean;
    center: boolean;
    right: boolean;
    justify: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
    ol: boolean;
    ul: boolean;
    link: boolean;
    quote: boolean;
    code: boolean;
    table: boolean;
    variable: boolean;
  }
}
