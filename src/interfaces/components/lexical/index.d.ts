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

  interface BlockOption {
    type: BlockType;
    label: string;
    onClick: () => void;
  }

  interface TableForm {
    rows: number;
    columns: number;
    includeHeaders: boolean;
  }
}
