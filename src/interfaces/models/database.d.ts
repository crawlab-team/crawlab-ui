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
}
