export declare global {
  interface SelectOption<T = any> {
    label?: string;
    value?: T;
    icon?: Icon;
    disabled?: boolean;
    children?: SelectOption[];

    [key: string]: any;
  }

  interface CheckboxTreeSelectOption<T = any> extends SelectOption<T> {
    id?: string;
    checked?: boolean;
    intermediate?: boolean;
    horizontal?: boolean;
    labelWidth?: string;
    children?: CheckboxTreeSelectOption[];
  }

  type CheckboxStatus = 'checked' | 'unchecked' | 'indeterminate';
}
