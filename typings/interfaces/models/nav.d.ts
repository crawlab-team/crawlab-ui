export declare global {
  interface NavItem<T = any> extends TreeNode<NavItem<T>> {
    id: string;
    title?: string;
    subtitle?: string;
    data?: T;
    icon?: Icon;
    iconSpinning?: boolean;
    tooltip?: string;
    emphasis?: boolean;
    style?: any;
    disabled?: boolean;
    badge?: string | number;
    badgeType?: BasicType;
  }
}
