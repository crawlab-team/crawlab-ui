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
) => {
  if (column.status && column.status !== 'updated') return column.status;
  const hasColumn = originalTable?.columns?.some(
    c =>
      column.name === c.name &&
      column.type === c.type &&
      column.not_null === c.not_null &&
      column.default === c.default &&
      column.primary === c.primary
  );
  if (hasColumn) return;
  return 'updated';
};

export const getIndexStatus = (
  index: DatabaseIndex,
  originalTable?: DatabaseTable
) => {
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
  console.debug(table?.name, table?.columns);
  if (!table?.name) return false;
  if (table.columns?.length === 0) return false;
  if (table.columns?.some(c => !c.name || !c.type)) return false;
  if (table.indexes?.some(i => !i.name || !i.columns?.length)) return false;
  console.debug('true');
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
