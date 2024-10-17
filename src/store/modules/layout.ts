import { plainClone } from '@/utils/object';
import { normalizeTree } from '@/utils/tree';
import { getDefaultMenuItems } from '@/router';
import { isPro } from '@/utils';
import { saveLocalStorage } from '@/utils/storage';

// persistent sidebar collapsed
const getDefaultSidebarCollapsed = (): boolean => {
  const collapsed = localStorage.getItem('sidebarCollapsed');
  if (collapsed) {
    return collapsed === 'true';
  }
  return false;
};

// persistent tabs
const getDefaultTabs = (): Tab[] => {
  const tabs = localStorage.getItem('tabs');
  if (tabs) {
    return JSON.parse(tabs) as Tab[];
  }
  return [];
};

// persistent active tab
const getDefaultActiveTabId = (): number | undefined => {
  const activeTabId = localStorage.getItem('activeTabId');
  if (activeTabId) {
    return parseInt(activeTabId);
  }
  return undefined;
};

// persistent max tab id
const getDefaultMaxTabId = (): number => {
  const maxTabId = localStorage.getItem('maxTabId');
  if (maxTabId) {
    return parseInt(maxTabId);
  }
  return 0;
};

export default {
  namespaced: true,
  state: {
    // sidebar
    sidebarCollapsed: getDefaultSidebarCollapsed(),
    menuItems: getDefaultMenuItems(),

    // tabs view
    activeTabId: getDefaultActiveTabId(),
    maxTabId: getDefaultMaxTabId(),
    tabs: getDefaultTabs(),
    draggingTab: undefined,
    targetTab: undefined,
    isTabsDragging: false,

    // nav
    navVisibleFn: (path: string) => true,

    // detail
    detailTabVisibleFn: (ns: StoreNamespace, tab: NavItem) => true,

    // action
    actionVisibleFn: (target: string, action: string) => true,
  },
  getters: {
    tabs: state => {
      const { draggingTab, targetTab, tabs } = state;
      if (!draggingTab || !targetTab) return tabs;
      const orderedTabs = plainClone(state.tabs) as Tab[];
      const draggingIdx = orderedTabs.map(t => t.id).indexOf(draggingTab?.id);
      const targetIdx = orderedTabs.map(t => t.id).indexOf(targetTab?.id);
      if (draggingIdx === -1 || targetIdx === -1) return tabs;
      orderedTabs.splice(draggingIdx, 1);
      orderedTabs.splice(targetIdx, 0, draggingTab);
      return orderedTabs;
    },
    activeTab: state => {
      const { tabs, activeTabId } = state;
      if (activeTabId === undefined) return;
      return tabs.find(d => d.id === activeTabId);
    },
    sidebarMenuItems: (state: LayoutStoreState) => {
      return state.menuItems
        .filter(d => !d.hidden)
        .filter(d => {
          if (!d.path) return false;
          return !(
            [
              '/notifications',
              '/environments',
              '/system',
              '/deps',
              '/gits',
              '/databases',
            ].includes(d.path) && !isPro()
          );
        })
        .filter(d => {
          if (!state.navVisibleFn) return true;
          if (!d.path) return true;
          return state.navVisibleFn(d.path);
        });
    },
    normalizedMenuItems: (state: LayoutStoreState) =>
      normalizeTree<MenuItem>(state.menuItems),
  },
  mutations: {
    setMenuItems(state: LayoutStoreState, items: MenuItem[]) {
      state.menuItems = items;
    },
    setSidebarCollapsed(state: LayoutStoreState, value: boolean) {
      state.sidebarCollapsed = value;
      saveLocalStorage('sidebarCollapsed', value);
    },
    setTabs(state: LayoutStoreState, tabs: Tab[]) {
      state.tabs = tabs;
      localStorage.setItem('tabs', JSON.stringify(tabs));
    },
    setActiveTabId(state: LayoutStoreState, id: number) {
      state.activeTabId = id;
      localStorage.setItem('activeTabId', id.toString());
    },
    addTab(state: LayoutStoreState, tab: Tab) {
      if (tab.id === undefined) tab.id = ++state.maxTabId;
      state.tabs.push(tab);
      localStorage.setItem('tabs', JSON.stringify(state.tabs));
      localStorage.setItem('maxTabId', state.maxTabId.toString());
    },
    updateTab(state: LayoutStoreState, tab: Tab) {
      const { tabs } = state;
      const idx = tabs.findIndex(d => d.id === tab.id);
      if (idx !== -1) {
        state.tabs[idx] = tab;
      }
      localStorage.setItem('tabs', JSON.stringify(state.tabs));
    },
    removeAllTabs(state: LayoutStoreState) {
      state.tabs = [];
      localStorage.removeItem('tabs');
    },
    removeTab(state: LayoutStoreState, tab: Tab) {
      if (tab.id === undefined) return;
      const idx = state.tabs.findIndex(d => d.id === tab.id);
      if (idx === -1) return;
      state.tabs.splice(idx, 1);
      localStorage.setItem('tabs', JSON.stringify(state.tabs));
    },
    setDraggingTab(state: LayoutStoreState, tab: Tab) {
      state.draggingTab = tab;
    },
    resetDraggingTab(state: LayoutStoreState) {
      state.draggingTab = undefined;
    },
    setTargetTab(state: LayoutStoreState, tab: Tab) {
      state.targetTab = tab;
    },
    resetTargetTab(state: LayoutStoreState) {
      state.targetTab = undefined;
    },
    setIsTabsDragging(state: LayoutStoreState, value: boolean) {
      state.isTabsDragging = value;
    },
    setNavVisibleFn(state: LayoutStoreState, fn: (path: string) => boolean) {
      state.navVisibleFn = fn;
    },
    setDetailTabVisibleFn(
      state: LayoutStoreState,
      fn: (ns: StoreNamespace, tab: NavItem) => boolean
    ) {
      state.detailTabVisibleFn = fn;
    },
    setActionVisibleFn(
      state: LayoutStoreState,
      fn: (target: string, action: string) => boolean
    ) {
      state.actionVisibleFn = fn;
    },
  },
  actions: {},
} as LayoutStoreModule;
