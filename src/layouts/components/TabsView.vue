<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { plainClone } from '@/utils/object';
import {
  getIconByAction,
  getIconByRouteConcept,
  getNavMenuItems,
  getRouteMenuItemsMap,
  translate,
} from '@/utils';
import { ACTION_ADD } from '@/constants';

const t = translate;

// store
const storeNameSpace = 'layout';
const store = useStore();
const { layout: state } = store.state as RootStoreState;

// route
const route = useRoute();

// router
const router = useRouter();

// current path
const currentPath = computed(() => route.path);

// tabs
const tabs = computed<Tab[]>(() => store.getters[`${storeNameSpace}/tabs`]);

const addTab = (tab: Tab) => {
  store.commit(`${storeNameSpace}/addTab`, tab);
};
const setActiveTab = (tab: Tab) => {
  store.commit(`${storeNameSpace}/setActiveTabId`, tab.id);
};

const updateTabs = (path: string) => {
  // active tab
  const activeTab = store.getters[`${storeNameSpace}/activeTab`] as
    | Tab
    | undefined;

  // skip if active tab is undefined
  if (!activeTab) return;

  // clone
  const activeTabClone = plainClone(activeTab);

  // set path to active tab
  activeTabClone.path = path;

  // update path of active tab
  store.commit(`${storeNameSpace}/updateTab`, activeTabClone);
};

watch(currentPath, updateTabs);

onMounted(() => {
  // find last tab
  const lastTab = tabs.value.find(tab => tab.path === currentPath.value);
  if (lastTab) {
    setActiveTab(lastTab);
    return;
  }

  // add current page to tabs
  addTab({ path: currentPath.value } as Tab);

  // set active tab id
  setActiveTab(tabs.value[tabs.value.length - 1]);
});

const getLastNavItem = (path: string): MenuItem | undefined => {
  const menuItemsMap = getRouteMenuItemsMap();
  const normalizedPath = path.replace(/[0-9a-f]{24}/, ':id');
  return menuItemsMap.get(normalizedPath);
};

const getLastNavItemIcon = (path: string): Icon => {
  const navItem = getLastNavItem(path);
  return navItem?.icon || getIconByRouteConcept(navItem?.routeConcept!);
};

const getNavItemLabel = (path: string): string => {
  const items = getNavMenuItems(path);
  return items.map(item => item.title).join(' / ');
};

const onTabChange = (tabId: number) => {
  setActiveTab({ id: tabId } as Tab);
  router.push(tabs.value.find(tab => tab.id === tabId)?.path || '/home');
};

const onTabRemove = (tabId: number) => {
  if (tabs.value.length === 1) {
    updateTabs('/home');
    router.push('/home');
    return;
  }
  if (state.activeTabId === tabId) {
    const index = tabs.value.findIndex(tab => tab.id === tabId);
    const nextTab = tabs.value[index + 1] || tabs.value[index - 1];
    if (!nextTab) return;
    setActiveTab(nextTab);
    router.push(nextTab.path);
  }
  store.commit(`${storeNameSpace}/removeTab`, { id: tabId } as Tab);
};

const onTabAdd = () => {
  addTab({ path: '/home' } as Tab);
  const newTab = tabs.value[tabs.value.length - 1];
  setActiveTab(newTab);
  router.push(newTab.path);
};

defineOptions({ name: 'ClTabsView' });
</script>

<template>
  <div class="tabs-view-wrapper">
    <div class="bottom-line" />
    <el-tabs
      :model-value="state.activeTabId"
      class="tabs-view"
      type="card"
      editable
      addable
      @tab-change="onTabChange"
      @tab-remove="onTabRemove"
      @tab-add="onTabAdd"
    >
      <template #add-icon>
        <el-tooltip :content="t('layouts.components.tabsView.add')">
          <div class="add-icon-wrapper">
            <cl-icon :icon="getIconByAction(ACTION_ADD)" />
          </div>
        </el-tooltip>
      </template>
      <el-tab-pane
        v-for="tab in tabs"
        :key="JSON.stringify(tab)"
        :name="tab.id"
      >
        <template #label>
          <span class="icon-wrapper">
            <cl-icon :icon="getLastNavItemIcon(tab.path)" />
          </span>
          <span class="label">{{ getNavItemLabel(tab.path) }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.tabs-view-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  background-color: var(--el-fill-color-light);
  height: var(--cl-tabs-view-height);

  .bottom-line {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 1px;
    background-color: var(--el-border-color-light);
    z-index: 2;
  }

  .tabs-view {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-flex;
    background-color: var(--cl-tabs-view-bg);
    height: var(--cl-tabs-view-height);
    border: none;
    border-bottom: 1px solid var(--cl-tabs-view-bg);
    z-index: 1;

    &:deep(.icon-wrapper) {
      margin-right: 5px;
    }

    &:deep(.el-tabs__header.is-top) {
      border-bottom: none;
      margin: 0;
    }

    &:deep(.el-tabs__new-tab) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      height: 100%;
      width: 40px;
      border: none;
      background-color: var(--el-fill-color-light);
    }

    &:deep(.el-tabs__new-tab .add-icon-wrapper) {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      width: 24px;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      border: 1px solid var(--el-border-color-light);
      border-radius: 50%;
    }

    &:deep(.el-tabs__nav) {
      border: none;
      border-radius: 0;
    }

    &:deep(.el-tabs__item:not(.is-active)) {
      color: var(--el-text-color-secondary);
      background-color: var(--el-fill-color-light);
    }

    &:deep(.el-tabs__item.is-active) {
      border-bottom: none;
    }

    &:deep(.el-tabs__item:last-child) {
      border-right: 1px solid var(--el-border-color-light);
    }

    &:deep(.el-tabs__item .is-icon-close) {
      width: 0;
    }

    &:deep(.el-tabs__item:hover .is-icon-close) {
      width: 14px;
      transform-origin: 100% 50%;
    }

    &:deep(.el-tabs__content) {
      display: none;
    }
  }
}
</style>
