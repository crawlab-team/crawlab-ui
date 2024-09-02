<script setup lang="ts">
import { translate } from '@/utils';
import { computed } from 'vue';
import { TAB_NAME_COLUMNS, TAB_NAME_DATA, TAB_NAME_INDEXES } from '@/constants';
import { useRoute } from 'vue-router';

const t = translate;

const route = useRoute();

const activeTabName = computed<string>(() => {
  return route.params.table || TAB_NAME_DATA;
});

const isNew = computed<boolean>(() => {
  return !!route.query.new;
});

const tabsItems = computed<NavItem[]>(() =>
  [
    { id: TAB_NAME_DATA, title: t('common.tabs.data') },
    { id: TAB_NAME_COLUMNS, title: t('common.tabs.columns') },
    { id: TAB_NAME_INDEXES, title: t('common.tabs.indexes') },
  ].filter(item => {
    if (isNew) {
      return item.id !== TAB_NAME_DATA;
    }
    return true;
  }),
);
</script>

<template>
  <div class="database-table-detail">
    <cl-nav-tabs
      :active-key="activeTabName"
      :items="tabsItems"
    >
      <template #extra>
        <div class="nav-tabs-actions">
          <cl-fa-icon-button
            type="primary"
            :icon="['fa', 'save']"
            :tooltip="t('components.database.actions.commitChanges')"
            size="small"
            :disabled="!hasChanges"
            :loading="commitLoading"
            @click.stop="onCommit"
          />
          <cl-fa-icon-button
            type="info"
            :icon="['fa', 'rotate-left']"
            :tooltip="t('components.database.actions.rollbackChanges')"
            size="small"
            :disabled="!hasChanges"
            @click.stop="onRollback"
          />
        </div>
      </template>
    </cl-nav-tabs>
    <div class="tab-content">
      <router-view
      /
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
