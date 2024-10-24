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

  interface DatabaseItem {
    timestamp?: number;
  }

  interface DatabaseDatabase extends DatabaseItem {
    name?: string;
    tables?: DatabaseTable[];
  }

  interface DatabaseTable extends DatabaseItem {
    name?: string;
    columns?: DatabaseColumn[];
    indexes?: DatabaseIndex[];
  }

  type DatabaseTableItemStatus = 'new' | 'updated' | 'deleted';

  interface DatabaseTableItem<T> {
    hash?: string;
    original_name?: string;
    status?: DatabaseTableItemStatus;
    contextMenuVisible?: boolean;
    isEdit?: Partial<Record<keyof T, boolean>>;
  }

  interface DatabaseColumn extends DatabaseTableItem<DatabaseColumn> {
    name?: string;
    type?: string;
    not_null?: boolean;
    default?: string;
    primary?: boolean;
    auto_increment?: boolean;
  }

  interface DatabaseIndex extends DatabaseTableItem<DatabaseIndex> {
    name: string;
    type?: string;
    columns: DatabaseIndexColumn[];
    unique: boolean;
  }

  interface DatabaseIndexColumn extends DatabaseTableItem<DatabaseIndexColumn> {
    name: string;
    order: number;
  }

  interface DatabaseNavItem<T = any> extends NavItem<T> {
    type?: 'database' | 'table' | 'columns' | 'indexes' | 'column' | 'index';
    name?: string;
    data_type?: string;
    children: DatabaseNavItem[];
    database?: string;
    new?: boolean;
    updated?: boolean;
    edit?: boolean;
    edit_name?: string;
    loading?: boolean;
  }

  type DatabaseTableClickRowType = 'name' | 'columns' | 'indexes';

  interface DatabaseTableRow extends TableAnyRowData {
    __status__?: DatabaseTableItemStatus;
    __hash__?: string;
    __edit__?: {
      [key: string]: boolean;
    };
  }

  type DatabaseDataType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'object'
    | 'array'
    | 'null'
    | 'objectid';

  interface DatabaseQueryResults {
    columns?: DatabaseColumn[];
    rows?: DatabaseTableRow[];
    output?: string;
    error?: string;
  }

  interface DatabaseTableManipulationStatements {
    select?: string;
    create?: string;
    alter?: string;
    truncate?: string;
    drop?: string;
  }

  interface DatabaseSyntaxKeywordRegex {
    from?: RegExp;
    manipulateTable?: RegExp;
    manipulateField?: RegExp;
  }

  interface DatabaseMetric extends BasicMetric {
    database_id?: string;
    connections?: number;
    query_per_second?: number;
    transaction_per_second?: number;
    cache_hit_ratio?: number;
    replication_lag?: number;
    lock_wait_time?: number;
  }
}
