export declare global {
  interface DraggableItemData {
    key: string;
    dragging: boolean;

    [prop: string]: any;
  }

  interface DraggableListInternalItems {
    draggingItem?: DraggableItemData;
    targetItem?: DraggableItemData;
  }
}
