export declare global {
  interface Role extends BaseModel {
    name?: string;
    description?: string;
    routes?: string[];
    admin?: boolean;
  }
}
