import { translate } from '@/utils/i18n';

const t = translate;

export const databaseDefaults: Database[] = [
  {
    name: 'MongoDB',
    data_source: 'mongo',
    host: 'localhost',
    port: 27017,
  },
  {
    name: 'MySQL',
    data_source: 'mysql',
    host: 'localhost',
    port: 3306,
  },
  {
    name: 'PostgreSQL',
    data_source: 'postgres',
    host: 'localhost',
    port: 5432,
  },
  {
    name: 'Microsoft SQL Server',
    data_source: 'mssql',
    host: 'localhost',
    port: 1433,
  },
  {
    name: 'ElasticSearch',
    data_source: 'elasticsearch',
    host: 'localhost',
    port: 9200,
  },
  {
    name: 'Oracle',
    data_source: 'oracle',
    host: 'localhost',
    port: 1521,
  },
  {
    name: 'DB2',
    data_source: 'db2',
    host: 'localhost',
    port: 50000,
  },
  {
    name: 'Cassandra',
    data_source: 'cassandra',
    host: 'localhost',
    port: 9042,
  },
  {
    name: 'Hive',
    data_source: 'hive',
    host: 'localhost',
    port: 10000,
  },
  {
    name: 'ClickHouse',
    data_source: 'clickhouse',
    host: 'localhost',
    port: 8123,
  },
  {
    name: 'Snowflake',
    data_source: 'snowflake',
    host: 'localhost',
    port: 443,
  },
  {
    name: 'Redis',
    data_source: 'redis',
    host: 'localhost',
    port: 6379,
  },
  {
    name: 'Kafka',
    data_source: 'kafka',
    host: 'localhost',
    port: 9092,
  },
];

export const getDatabaseDefaultByDataSource = (
  dataSource: DatabaseDataSource
): Database | undefined => {
  return databaseDefaults.find(database => database.data_source === dataSource);
};

export const getColumnStatus = (
  column: DatabaseColumn,
  originalTable?: DatabaseTable
): DatabaseTableItemStatus | undefined => {
  if (column.status && column.status !== 'updated') return column.status;
  const hasColumn = originalTable?.columns?.some(
    c =>
      column.name === c.name &&
      column.type === c.type &&
      column.not_null === c.not_null &&
      column.default === c.default &&
      column.primary === c.primary &&
      column.auto_increment === c.auto_increment
  );
  if (hasColumn) return;
  return 'updated';
};

export const getIndexStatus = (
  index: DatabaseIndex,
  originalTable?: DatabaseTable
): DatabaseTableItemStatus | undefined => {
  if (index.status && index.status !== 'updated') return index.status;
  const hasIndex = originalTable?.indexes?.some(
    idx =>
      index.name === idx.name &&
      index.type === idx.type &&
      JSON.stringify(index.columns) === JSON.stringify(idx.columns) &&
      index.unique === idx.unique
  );
  if (hasIndex) return;
  return 'updated';
};

export const isValidTable = (table?: DatabaseTable) => {
  if (!table?.name) return false;
  if (table.columns?.length === 0) return false;
  if (table.columns?.some(c => !c.name || !c.type)) return false;
  if (table.indexes?.some(i => !i.name || !i.columns?.length)) return false;
  return true;
};

export const getDefaultIndexName = (
  table: DatabaseTable,
  columns: DatabaseIndexColumn[]
) => {
  return `${table.name}_${columns.map(c => c.name).join('_')}_idx`;
};

export const isDefaultIndexName = (
  table: DatabaseTable,
  index: DatabaseIndex
) => {
  return index.name === getDefaultIndexName(table, index.columns);
};

export const canColumnAutoIncrement = (column: DatabaseColumn) => {
  return column.primary && column.type?.match(/int/i);
};

export const getDataType = (type: string): DatabaseDataType => {
  const lowerType = type.toLowerCase();

  // Integer types
  if (/^int|integer|smallint|bigint|tinyint|mediumint$/.test(lowerType)) {
    return 'number';
  }

  // Floating point types
  if (/^float|real|double|numeric|decimal/.test(lowerType)) {
    return 'number';
  }

  // Boolean type
  if (/^bool|bit$/.test(lowerType)) {
    return 'boolean';
  }

  // String types
  if (/^char|text|string$/.test(lowerType)) {
    return 'string';
  }

  // Timestamp/DateTime types
  if (/^(timestamp|datetime|timestamptz)$/.test(lowerType)) {
    return 'datetime';
  }

  // Date type
  if (/^date$/.test(lowerType)) {
    return 'date';
  }

  // Time type
  if (/^time$/.test(lowerType)) {
    return 'string'; // Time represented as string
  }

  // JSON types
  if (/^(json|jsonb)$/.test(lowerType)) {
    return 'object';
  }

  // Array type
  if (/^array$/.test(lowerType) || lowerType.endsWith('[]')) {
    return 'array';
  }

  // UUID type
  if (/^(uuid|uniqueidentifier)$/.test(lowerType)) {
    return 'string';
  }

  // Binary data type
  if (/^(bytea|blob|binary|varbinary|image)$/.test(lowerType)) {
    return 'object'; // Assuming binary data is treated as an object
  }

  // MongoDB-specific types
  if (/^(objectid|long|decimal128|object|isodate)$/.test(lowerType)) {
    switch (lowerType) {
      case 'long':
      case 'decimal128':
        return 'number';
      case 'objectid':
        return 'objectid';
      case 'object':
        return 'object';
      case 'isodate':
        return 'datetime';
    }
  }

  // Default case
  return 'null';
};

export const normalizeDataType = (value: any, type: string) => {
  const dataType = getDataType(type);
  if (dataType === 'null') return value;

  switch (dataType) {
    case 'number':
      return Number(value);
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
      }
      return Boolean(value); // Fallback for other types
    case 'string':
      return String(value);
    case 'date':
    case 'datetime':
      return value;
    case 'array':
      return Array.isArray(value) ? value : [value];
    case 'object':
      return typeof value === 'object' ? value : JSON.parse(value);
    case 'objectid':
      return value;
    default:
      return value; // Default case
  }
};

export const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'ORDER BY',
  'GROUP BY',
  'HAVING',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'DELETE',
  'CREATE TABLE',
  'DROP TABLE',
  'ALTER TABLE',
  'ADD COLUMN',
  'DISTINCT',
  'LIMIT',
  'COUNT',
  'SUM',
  'MAX',
  'MIN',
  'AVG',
];

export const MONGO_KEYWORDS = [
  'db',
  'collection',
  'find',
  'findOne',
  'insertOne',
  'insertMany',
  'updateOne',
  'updateMany',
  'deleteOne',
  'deleteMany',
  'drop',
  'createIndex',
  'dropIndex',
];

export const getTableManipulationStatementsByDataSource = (
  dataSource: DatabaseDataSource,
  tableName?: string
): DatabaseTableManipulationStatements => {
  switch (dataSource) {
    case 'mongo':
      return {
        select: `db.${tableName}.find({});`,
        truncate: `db.${tableName}.deleteMany({});`,
        drop: `db.${tableName}.drop();`,
      };
    case 'mysql':
    case 'postgres':
    case 'mssql':
      return {
        select: 'SELECT * FROM ' + `${tableName};`,
        create: 'CREATE TABLE new_table_name (id INT PRIMARY KEY ...);',
        alter: 'ALTER TABLE ${tableName} ...',
        truncate: `TRUNCATE TABLE ${tableName};`,
        drop: `DROP TABLE ${tableName};`,
      };
    default:
      return {};
  }
};

export const getDatabaseSyntaxKeywordRegexByDataSource = (
  dataSource: DatabaseDataSource
): DatabaseSyntaxKeywordRegex => {
  switch (dataSource) {
    case 'mongo':
      return {
        from: /\bdb\./i,
      };
    case 'mysql':
    case 'postgres':
    case 'mssql':
      return {
        from: /\b(FROM|JOIN)\b/i,
        manipulateTable:
          /\b(INSERT\s+INTO|UPDATE|ALTER\s+TABLE|DROP\s+TABLE)\b/i,
        manipulateField:
          /\b(FROM|JOIN|INSERT\s+INTO|UPDATE|ALTER\s+TABLE|DROP\s+TABLE)\s+(\w+)/i,
      };
    default:
      return {};
  }
};

export const getDatabaseEditorLanguage = (
  dataSource: DatabaseDataSource
): string => {
  switch (dataSource) {
    case 'mongo':
      return 'javascript';
    case 'mysql':
    case 'postgres':
    case 'mssql':
      return 'sql';
    default:
      return 'plaintext';
  }
};

export const getDatabaseSyntaxKeywords = (
  dataSource: DatabaseDataSource
): string[] => {
  switch (dataSource) {
    case 'mongo':
      return MONGO_KEYWORDS;
    case 'mysql':
    case 'postgres':
    case 'mssql':
      return SQL_KEYWORDS;
    default:
      return [];
  }
};

export const getDatabaseAllMetricGroups = (): MetricGroup<DatabaseMetric>[] => [
  {
    name: 'cpu_usage_percent',
    label: t('components.metric.metrics.cpu_usage_percent'),
    metrics: ['cpu_usage_percent'],
    format: 'percent',
  },
  {
    name: 'total_memory',
    label: t('components.metric.metrics.total_memory'),
    metrics: ['total_memory'],
    format: 'bytes',
  },
  {
    name: 'available_memory',
    label: t('components.metric.metrics.available_memory'),
    metrics: ['available_memory'],
    format: 'bytes',
  },
  {
    name: 'used_memory',
    label: t('components.metric.metrics.used_memory'),
    metrics: ['used_memory'],
    format: 'bytes',
  },
  {
    name: 'used_memory_percent',
    label: t('components.metric.metrics.used_memory_percent'),
    metrics: ['used_memory_percent'],
    format: 'percent',
  },
  {
    name: 'total_disk',
    label: t('components.metric.metrics.total_disk'),
    metrics: ['total_disk'],
    format: 'bytes',
  },
  {
    name: 'available_disk',
    label: t('components.metric.metrics.available_disk'),
    metrics: ['available_disk'],
    format: 'bytes',
  },
  {
    name: 'used_disk',
    label: t('components.metric.metrics.used_disk'),
    metrics: ['used_disk'],
    format: 'bytes',
  },
  {
    name: 'used_disk_percent',
    label: t('components.metric.metrics.used_disk_percent'),
    metrics: ['used_disk_percent'],
    format: 'percent',
  },
  {
    name: 'connections',
    label: t('components.metric.metrics.connections'),
    metrics: ['connections'],
    format: 'number',
  },
  {
    name: 'query_per_second',
    label: t('components.metric.metrics.query_per_second'),
    metrics: ['query_per_second'],
    format: 'number',
  },
  {
    name: 'cache_hit_ratio',
    label: t('components.metric.metrics.cache_hit_ratio'),
    metrics: ['cache_hit_ratio'],
    format: 'percent',
    formatDecimal: 1,
  },
  {
    name: 'replication_lag',
    label: t('components.metric.metrics.replication_lag'),
    metrics: ['replication_lag'],
    format: 'duration',
  },
  {
    name: 'lock_wait_time',
    label: t('components.metric.metrics.lock_wait_time'),
    metrics: ['lock_wait_time'],
    format: 'duration',
  },
];
