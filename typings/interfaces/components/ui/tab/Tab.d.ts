export declare global {
  interface Tab extends DraggableItemData {
    id?: number;
    path: string;
    isAction?: boolean;
  }
}
