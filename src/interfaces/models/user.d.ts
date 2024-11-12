export declare global {
  interface User {
    _id?: string;
    username?: string;
    password?: string;
    role?: string;
    role_id?: string;
    email?: string;
    admin?: boolean;
    root_admin?: boolean;
    routes?: string[];
  }
}
