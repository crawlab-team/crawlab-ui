export declare global {
  interface Token extends BaseModel {
    name?: string;
    token?: string;
    _visible?: boolean;
  }
}
