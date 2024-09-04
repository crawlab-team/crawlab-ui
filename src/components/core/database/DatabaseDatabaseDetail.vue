<script setup lang="tsx">
import { translate } from '@/utils';
import { computed, ref, watch } from 'vue';
import { ClNavLink } from '@/components';

const props = defineProps<{
  database?: DatabaseDatabase;
}>();

const emit = defineEmits<{
  (
    e: 'click-table',
    table: DatabaseTable,
    type: DatabaseTableClickRowType
  ): void;
}>();

const t = translate;

const form = ref<DatabaseTable>(props.database || {});
watch(
  () => props.database,
  () => {
    form.value = props.database || {};
  }
);

const tablesColumns = computed<TableColumns<DatabaseTable>>(() => [
  {
    key: 'name',
    label: t('components.database.databases.database.tables.name'),
    width: 200,
    value: (row: DatabaseTable) => (
      <ClNavLink
        label={row.name}
        onClick={() => emit('click-table', row, 'name')}
      />
    ),
  },
  {
    key: 'columns',
    label: t('components.database.databases.database.tables.columns'),
    width: 200,
    value: (row: DatabaseTable) => (
      <ClNavLink
        label={row.columns?.length || 0}
        onClick={() => emit('click-table', row, 'columns')}
      />
    ),
  },
  {
    key: 'indexes',
    label: t('components.database.databases.database.tables.indexes'),
    width: 200,
    value: (row: DatabaseTable) => (
      <ClNavLink
        label={row.indexes?.length || 0}
        onClick={() => emit('click-table', row, 'indexes')}
      />
    ),
  },
]);

const tablesData = computed<TableData<DatabaseTable>>(() => {
  return props.database?.tables || [];
});

defineOptions({ name: 'ClDatabaseDatabaseDetail' });
</script>

<template>
  <div class="database-database-detail">
    <cl-table
      :columns="tablesColumns"
      :data="tablesData"
      embedded
      hide-footer
    />
  </div>
</template>

<style scoped>
.database-database-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
