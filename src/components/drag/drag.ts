import { SetupContext } from 'vue';

export interface DraggableItemData {
  key: string;
  dragging: boolean;

  [prop: string]: any;
}

export interface DraggableListProps {
  items: DraggableItemData[];
  itemKey: string;
}

export interface DraggableListContext {
  ctx: SetupContext<any>;
  props: DraggableListProps;
}

export interface DraggableListInternalItems {
  draggingItem?: DraggableItemData;
  targetItem?: DraggableItemData;
}
