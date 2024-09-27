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
    name: 'ElasticSearch',
    data_source: 'elasticsearch',
    host: 'localhost',
    port: 9200,
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

export const normalizeDataType = (value: any, type: string) => {
  if (!type) return value;

  const lowerType = type.toLowerCase();

  // Helper function for fuzzy matching
  const fuzzyMatch = (pattern: string) =>
    new RegExp(pattern, 'i').test(lowerType);

  // Integer types
  if (fuzzyMatch('int|integer|smallint|bigint|tinyint|mediumint')) {
    return Number.isInteger(Number(value))
      ? Number(value)
      : Math.floor(Number(value));
  }

  // Floating point types
  if (fuzzyMatch('float|real|double|numeric|decimal')) {
    return isNaN(parseFloat(value)) ? null : parseFloat(value);
  }

  // Boolean type
  if (fuzzyMatch('bool|bit')) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string')
      return value.toLowerCase() === 'true' || value === '1';
    return Boolean(value);
  }

  // String types
  if (fuzzyMatch('char|text|string')) {
    return value !== null && value !== undefined ? String(value) : null;
  }

  // Date type
  if (/^date$/.test(lowerType)) {
    return value ? new Date(value).toISOString().split('T')[0] : null;
  }

  // Time type
  if (/^time$/.test(lowerType)) {
    return value
      ? new Date(`1970-01-01T${value}`)
          .toISOString()
          .split('T')[1]
          .split('.')[0]
      : null;
  }

  // Timestamp/DateTime types
  if (/^(timestamp|datetime|timestamptz)$/.test(lowerType)) {
    return value ? new Date(value).toISOString() : null;
  }

  // JSON types
  if (/^(json|jsonb)$/.test(lowerType)) {
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  // Array type
  if (/^array$/.test(lowerType) || lowerType.endsWith('[]')) {
    return Array.isArray(value) ? value : [value];
  }

  // UUID type
  if (/^(uuid|uniqueidentifier)$/.test(lowerType)) {
    return value !== null && value !== undefined ? String(value) : null;
  }

  // Binary data type
  if (/^(bytea|blob|binary|varbinary|image)$/.test(lowerType)) {
    // For binary data, we might need to handle this differently depending on the frontend requirements
    return value;
  }

  // MongoDB-specific types
  if (/^(objectid|long|decimal128)$/.test(lowerType)) {
    return value; // These types are typically handled by MongoDB drivers
  }

  // Default case
  return value;
};
