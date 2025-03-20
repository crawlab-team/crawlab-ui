export declare global {
  type BasicType =
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'text'
    | 'default';
  type BasicEffect = 'dark' | 'light' | 'plain';
  type BasicSize = 'small' | 'default' | 'large';

  type ElFormValidator = (rule: any, value: any, callback: any) => void;

  interface ElFormRule {
    required: boolean;
    trigger: string;
    validator: ElFormValidator;
  }
}
