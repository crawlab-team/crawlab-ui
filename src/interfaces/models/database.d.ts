import {
  DATABASE_STATUS_ONLINE,
  DATABASE_STATUS_OFFLINE,
} from '@/constants/database';

export declare global {
  interface Database extends BaseModel {
    name?: string;
    data_source?: DatabaseDataSource;
    status?: DatabaseStatus;
    error?: string;
    description?: string;
    host?: string;
    port?: number;
    url?: string;
    hosts?: string[];
    username?: string;
    password?: string;
    database?: string;
    is_default?: boolean;
  }

  type DatabaseDataSource =
    | 'mongo'
    | 'mysql'
    | 'postgres'
    | 'mssql'
    | 'oracle'
    | 'db2'
    | 'cassandra'
    | 'hive'
    | 'clickhouse'
    | 'snowflake'
    | 'elasticsearch'
    | 'redis'
    | 'kafka';

  type DatabaseStatus = DATABASE_STATUS_ONLINE | DATABASE_STATUS_OFFLINE;

  interface DatabaseMetadata {
    databases: DatabaseDatabase[];
  }

  interface DatabaseDatabase {
    name?: string;
    tables?: DatabaseTable[];
  }

  interface DatabaseTable {
    name?: string;
    columns?: DatabaseColumn[];
    indexes?: DatabaseIndex[];
  }

  interface DatabaseColumn {
    name?: string;
    type?: string;
    null?: boolean; // Use ? to make this property optional
    key?: string;
    default?: string;
    extra?: string;
    children?: DatabaseColumn[];
  }

  interface DatabaseIndex {
    name: string;
    type?: string;
    columns: DatabaseIndexColumn[];
    unique: boolean;
  }

  interface DatabaseIndexColumn {
    name: string;
    order: number;
  }

  interface DatabaseNavItem<T = any> extends NavItem<T> {
    type?: 'database' | 'table' | 'columns' | 'indexes' | 'column' | 'index';
    name?: string;
    data_type?: string;
    children: DatabaseNavItem[];
    database?: string;
    table?: DatabaseTable;
  }

  type DatabaseTableClickRowType = 'name' | 'columns' | 'indexes';
}
