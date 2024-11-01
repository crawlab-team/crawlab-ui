export declare global {
  interface ContextMenuItem {
    title: string;
    icon?: Icon;
    action?: () => void | Promise<void>;
    className?: string;
    disabled?: boolean;
  }
}
