<script setup lang="ts">
import { translate } from '@/utils';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import {
  TAB_NAME_COLUMNS,
  TAB_NAME_INDEXES,
  TAB_NAME_OVERVIEW,
} from '@/constants';

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const visible = computed<boolean>(
  () => state.activeDialogKey === 'createTable'
);

const activeTabName = ref<string>('overview');
const tabItems = computed<NavItem[]>(() => [
  {
    id: TAB_NAME_OVERVIEW,
    title: t('views.database.databases.dialog.createTable.tabs.overview.name'),
  },
  {
    id: TAB_NAME_COLUMNS,
    title: t('views.database.databases.dialog.createTable.tabs.columns.name'),
  },
  {
    id: TAB_NAME_INDEXES,
    title: t('views.database.databases.dialog.createTable.tabs.indexes.name'),
  },
]);

defineOptions({ name: 'ClCreateEditDatabaseTableDialog' });
</script>

<template>
  <cl-dialog
    :visible="visible"
    :title="t('views.database.databases.dialog.createTable.title')"
    @close="store.commit(`${ns}/hideDialog`)"
  >
    <cl-nav-tabs
      :items="tabItems"
      :activeKey="activeTabName"
      @select="id => (activeTabName = id)"
    />
    <div class="tab-container">
      <template v-if="activeTabName === TAB_NAME_OVERVIEW">
        <cl-form>
          <cl-form-item
            :span="4"
            :label="
              t(
                'views.database.databases.dialog.createTable.tabs.overview.form.name'
              )
            "
            prop="name"
            required
          >
            <el-input
              :placeholder="
                t(
                  'views.database.databases.dialog.createTable.tabs.overview.form.name'
                )
              "
            />
          </cl-form-item>
        </cl-form>
      </template>
    </div>
  </cl-dialog>
</template>

<style scoped>
.tab-container {
  padding: 20px 0 0;
}
</style>
