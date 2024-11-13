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
    admin?: boolean;
    root_admin?: boolean;
    routes?: string[];
  }
}
