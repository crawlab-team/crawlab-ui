export declare global {
  interface Role extends BaseModel {
    name?: string;
    description?: string;
    routes?: string[];
    root_admin?: boolean;
    users?: number;
  }
}
