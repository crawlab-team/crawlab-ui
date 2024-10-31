import { TooltipTriggerType } from 'element-plus/es/components/tooltip/src/trigger';
import { Placement } from '@popperjs/core';
import { Ref, StyleValue } from 'vue';

export interface ContextMenuProps {
  trigger?: TooltipTriggerType;
  visible?: boolean;
  placement?: Placement;
  style?: StyleValue;
}

export interface ContextMenuListProps {
  items: ContextMenuItem[];
}
