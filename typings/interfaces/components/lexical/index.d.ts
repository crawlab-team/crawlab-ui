import { InsertTableCommandPayloadHeaders } from '@lexical/table';

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
}
