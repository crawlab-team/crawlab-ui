import type { TooltipTriggerType } from 'element-plus/es/components/tooltip/src/trigger';
import type { ContextMenuItem } from '@/components/ui/context-menu/types';

export interface ButtonProps {
  tooltip?: string;
  type?: BasicType;
  size?: BasicSize;
  round?: boolean;
  circle?: boolean;
  plain?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
  noMargin?: boolean;
}

export interface IconButtonProps extends ButtonProps {
  icon: Icon;
}

export interface FaIconButtonProps extends IconButtonProps {
  badgeIcon?: Icon;
  spin?: boolean;
}

export interface LabelButtonProps extends ButtonProps {
  label?: string;
  icon?: Icon;
}

type GenericButtonProps = (
  | ButtonProps
  | IconButtonProps
  | FaIconButtonProps
  | LabelButtonProps
) & {
  buttonType?: ButtonType;
};

export interface ButtonGroupProps {
  buttons?: GenericButtonProps[];
  dropdownItems?: ContextMenuItem[];
  dropdownTrigger?: TooltipTriggerType;
  type?: BasicType;
  size?: BasicSize;
}

export interface ButtonEmits {
  (e: 'click', event: Event): void;

  (e: 'mouseenter', event: Event): void;

  (e: 'mouseleave', event: Event): void;
}

export type ButtonType = 'button' | 'fa-icon' | 'icon' | 'label';
