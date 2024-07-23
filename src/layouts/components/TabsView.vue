<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { Plus } from '@element-plus/icons-vue';
import { plainClone } from '@/utils/object';
import { getNavMenuItems, getRouteMenuItemsMap } from '@/utils';

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
  <el-tabs
    :model-value="state.activeTabId"
    class="tabs-view"
    type="border-card"
    editable
    addable
    @tab-change="onTabChange"
    @tab-remove="onTabRemove"
    @tab-add="onTabAdd"
  >
    <template #add-icon>
      <el-icon>
        <plus />
      </el-icon>
    </template>
    <el-tab-pane v-for="tab in tabs" :key="JSON.stringify(tab)" :name="tab.id">
      <template #label>
        <cl-icon :icon="getLastNavItem(tab.path)?.icon" />
        <span style="margin-left: 3px">{{ getNavItemLabel(tab.path) }}</span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.tabs-view {
  background-color: var(--cl-tabs-view-bg);
  height: var(--cl-tabs-view-height);
  border: none;

  &:deep(.el-tabs__item.is-active) {
    border-bottom: 1px solid #ffffff;
  }

  &:deep(.el-tabs__item .is-icon-close) {
    width: 0;
  }

  &:deep(.el-tabs__item:hover .is-icon-close) {
    width: 14px;
    transform-origin: 100% 50%;
  }

  &:deep(.el-tabs__new-tab) {
    margin-right: 10px;
    background-color: #ffffff;
  }

  &:deep(.el-tabs__content) {
    display: none;
  }
}
</style>
