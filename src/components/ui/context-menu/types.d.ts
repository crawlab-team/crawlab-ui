import { TooltipTriggerType } from 'element-plus/es/components/tooltip/src/trigger';
import { Placement } from '@popperjs/core';
import { StyleValue } from 'vue';

export interface ContextMenuProps {
  trigger?: TooltipTriggerType;
  visible?: boolean;
  activeItem?: FileNavItem;
  placement?: Placement;
  clicking?: boolean;
  style?: StyleValue;
}

export interface ContextMenuListProps {
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  title: string;
  icon?: Icon;
  action?: () => void;
  className?: string;
  disabled?: boolean;
}

export type FileEditorContextMenuItemVisibleFn = (
  contextMenuItem: ContextMenuItem,
  activeFileNavItem?: FileNavItem
) => boolean;
