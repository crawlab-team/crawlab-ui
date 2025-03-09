import { plainClone } from '@/utils/object';
import { normalizeTree } from '@/utils/tree';
import { getDefaultSidebarMenuItems } from '@/router';
import { isAllowedRoutePath, isPro } from '@/utils';
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

// persistent chatbot sidebar visible
const getDefaultChatbotSidebarVisible = (): boolean => {
  const visible = localStorage.getItem('chatbotSidebarVisible');
  if (visible) {
    return visible === 'true';
  }
  return false;
};

// persistent chatbot sidebar width
const getDefaultChatbotSidebarWidth = (): number => {
  const width = localStorage.getItem('chatbotSidebarWidth');
  if (width) {
    return parseInt(width);
  }
  return 350; // Default width
};

export default {
  namespaced: true,
  state: {
    // sidebar
    sidebarCollapsed: getDefaultSidebarCollapsed(),
    menuItems: getDefaultSidebarMenuItems(),

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
    
    // chatbot
    chatbotSidebarVisible: getDefaultChatbotSidebarVisible(),
    chatbotSidebarWidth: getDefaultChatbotSidebarWidth(),
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
      return (
        state.menuItems
          // filter hidden items
          .filter(d => !d.hidden)
          // filter items by pro
          .filter(d => {
            // skip if no path
            if (!d.path) return false;

            if (isPro()) {
              // skip some items if pro
              return !['router.menuItems.users'].includes(d.title);
            } else {
              // skip some items if not pro
              switch (d.path) {
                case '/notifications':
                case '/environments':
                case '/system':
                case '/deps':
                case '/gits':
                case '/databases':
                case '/dependencies':
                  return false;
                default:
                  return ['usersManagement'].every(
                    key => !d.title.includes(key)
                  );
              }
            }
          })
          // filter items by navVisibleFn
          .filter(d => {
            if (!state.navVisibleFn) return true;
            if (!d.path) return true;
            return state.navVisibleFn(d.path);
          })
          // filter items by allowed routes
          .filter(d => {
            if (isAllowedRoutePath(d.path!)) return true;
            return d.children?.some(c => isAllowedRoutePath(c.path!));
          })
          // filter children by allowed routes
          .map(d => {
            return {
              ...d,
              children: d.children?.filter(c => isAllowedRoutePath(c.path!)),
            };
          })
      );
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
    setChatbotSidebarVisible(state: LayoutStoreState, value: boolean) {
      // This controls both sidebar visibility and toggle button placement:
      // - When true: button appears in ChatSidebar header
      // - When false: button appears in main Header
      state.chatbotSidebarVisible = value;
      
      // Ensure we're saving the correct boolean string representation to localStorage
      localStorage.setItem('chatbotSidebarVisible', value ? 'true' : 'false');
    },
    setChatbotSidebarWidth(state: LayoutStoreState, value: number) {
      state.chatbotSidebarWidth = value;
      // Use localStorage directly for consistency with how we read the value
      localStorage.setItem('chatbotSidebarWidth', value.toString());
    },
  },
  actions: {},
} as LayoutStoreModule;
