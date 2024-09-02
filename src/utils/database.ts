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
      column.null === c.null &&
      column.default === c.default
  );
  if (hasColumn) return;
  return 'updated';
};
