import {
  DATABASE_TYPE_MONGO,
  DATABASE_TYPE_MYSQL,
  DATABASE_TYPE_POSTGRESQL,
  DATABASE_TYPE_MSSQL,
  DATABASE_TYPE_ELASTICSEARCH,
  DATABASE_TYPE_KAFKA,
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
    port?: string;
    url?: string;
    hosts?: string[];
    username?: string;
    password?: string;
    database?: string;
    is_default?: boolean;
  }

  type DatabaseDataSource =
    | DATABASE_TYPE_MONGO
    | DATABASE_TYPE_MYSQL
    | DATABASE_TYPE_POSTGRESQL
    | DATABASE_TYPE_MSSQL
    | DATABASE_TYPE_ELASTICSEARCH
    | DATABASE_TYPE_KAFKA;

  type DatabaseStatus = DATABASE_STATUS_ONLINE | DATABASE_STATUS_OFFLINE;
}
