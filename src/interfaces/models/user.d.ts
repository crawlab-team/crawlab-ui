export declare global {
  interface User {
    _id?: string;
    username?: string;
    password?: string;
    role?: string;
    role_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    root_admin?: boolean;
    root_admin_role?: boolean;
    routes?: string[];
  }
}
