export declare global {
  interface MenuItem extends TreeNode<MenuItem> {
    title: string;
    path?: string;
    icon?: Icon;
    hidden?: boolean;
    routeConcept?: RouteConcept;
  }
}
