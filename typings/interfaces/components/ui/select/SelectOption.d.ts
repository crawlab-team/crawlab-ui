export declare global {
  interface SelectOption<T = any> {
    label?: string;
    value?: T;
    icon?: Icon;
    disabled?: boolean;
    children?: SelectOption[];

    [key: string]: any;
  }
}
