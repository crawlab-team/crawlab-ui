import { VNode } from 'vue';

export interface TagProps {
  label?: string;
  tooltip?: string | VNode;
  type?: BasicType;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  icon?: Icon;
  suffixIcon?: Icon;
  size?: BasicSize;
  spinning?: boolean;
  width?: string;
  effect?: BasicEffect;
  clickable?: boolean;
  closable?: boolean;
  disabled?: boolean;
  className?: string;
  short?: boolean;
  maxWidth?: string;
}

export interface CheckTagProps extends TagProps {
  modelValue: boolean;
}

export interface CheckTagGroupProps {
  modelValue: string[];
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

export interface LinkTagProps extends TagProps {
  path?: string;
}
