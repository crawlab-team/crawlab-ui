import {
  DATA_SOURCE_TYPE_MONGO,
  DATA_SOURCE_TYPE_MYSQL,
  DATA_SOURCE_TYPE_POSTGRESQL,
  DATA_SOURCE_TYPE_MSSQL,
  DATA_SOURCE_TYPE_SQLITE,
  DATA_SOURCE_TYPE_COCKROACHDB,
  DATA_SOURCE_TYPE_ELASTICSEARCH,
  DATA_SOURCE_TYPE_KAFKA,
  DATA_SOURCE_STATUS_ONLINE,
  DATA_SOURCE_STATUS_OFFLINE,
  DATA_SOURCE_CONNECT_TYPE_STANDARD,
  DATA_SOURCE_CONNECT_TYPE_URL,
  DATA_SOURCE_CONNECT_TYPE_HOSTS,
} from '@/constants/ds';

export declare global {
  interface DataSource extends BaseModel {
    name?: string;
    type?: DataSourceType;
    connect_type?: DataSourceConnectType;
    status?: DataSourceStatus;
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

  type DataSourceType =
    | DATA_SOURCE_TYPE_MONGO
    | DATA_SOURCE_TYPE_MYSQL
    | DATA_SOURCE_TYPE_POSTGRESQL
    | DATA_SOURCE_TYPE_MSSQL
    | DATA_SOURCE_TYPE_SQLITE
    | DATA_SOURCE_TYPE_COCKROACHDB
    | DATA_SOURCE_TYPE_ELASTICSEARCH
    | DATA_SOURCE_TYPE_KAFKA;

  type DataSourceStatus =
    | DATA_SOURCE_STATUS_ONLINE
    | DATA_SOURCE_STATUS_OFFLINE;

  type DataSourceConnectType =
    | DATA_SOURCE_CONNECT_TYPE_STANDARD
    | DATA_SOURCE_CONNECT_TYPE_URL
    | DATA_SOURCE_CONNECT_TYPE_HOSTS;
}
