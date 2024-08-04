import {
  DATABASE_TYPE_MONGO,
  DATABASE_TYPE_MYSQL,
  DATABASE_TYPE_POSTGRESQL,
  DATABASE_TYPE_MSSQL,
  DATABASE_TYPE_SQLITE,
  DATABASE_TYPE_COCKROACHDB,
  DATABASE_TYPE_ELASTICSEARCH,
  DATABASE_TYPE_KAFKA,
  DATABASE_STATUS_ONLINE,
  DATABASE_STATUS_OFFLINE,
  DATABASE_CONNECT_TYPE_STANDARD,
  DATABASE_CONNECT_TYPE_URL,
  DATABASE_CONNECT_TYPE_HOSTS,
} from '@/constants/database';

export declare global {
  interface Database extends BaseModel {
    name?: string;
    type?: DatabaseType;
    connect_type?: DatabaseConnectType;
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
  }

  type DatabaseType =
    | DATABASE_TYPE_MONGO
    | DATABASE_TYPE_MYSQL
    | DATABASE_TYPE_POSTGRESQL
    | DATABASE_TYPE_MSSQL
    | DATABASE_TYPE_SQLITE
    | DATABASE_TYPE_COCKROACHDB
    | DATABASE_TYPE_ELASTICSEARCH
    | DATABASE_TYPE_KAFKA;

  type DatabaseStatus = DATABASE_STATUS_ONLINE | DATABASE_STATUS_OFFLINE;

  type DatabaseConnectType =
    | DATABASE_CONNECT_TYPE_STANDARD
    | DATABASE_CONNECT_TYPE_URL
    | DATABASE_CONNECT_TYPE_HOSTS;
}
