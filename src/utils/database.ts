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
  if (/^(objectid|long|decimal128)$/.test(lowerType)) {
    return 'object'; // Handled by MongoDB drivers
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
      return value ? new Date(value) : null; // Convert to Date object
    case 'array':
      return Array.isArray(value) ? value : [value];
    case 'object':
      return typeof value === 'object' ? value : JSON.parse(value);
    default:
      return value; // Default case
  }
};
