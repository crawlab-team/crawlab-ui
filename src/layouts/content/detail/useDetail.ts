import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, watch, provide, ref } from 'vue';
import { getRoutePathByDepth, getTabName } from '@/utils/route';
import { ElMessage } from 'element-plus';
import { translate } from '@/utils/i18n';
import { debounce } from '@/utils';

// i18n
const t = translate;

const useDetail = <T = BaseModel>(ns: ListStoreNamespace) => {
  const router = useRouter();
  const route = useRoute();

  // store state
  const store = useStore();
  const state = store.state[ns] as BaseStoreState;
  const { form } = state;

  const navSidebar = ref<NavSidebar | null>(null);

  const navActions = ref<NavActions | null>(null);

  const showActionsToggleTooltip = ref<boolean>(false);

  const navItems = computed<NavItem<T>[]>(() =>
    state.allList.map((d: BaseModel) => {
      return {
        id: d._id,
        title: d.name,
      } as NavItem;
    })
  );

  const activeId = computed<string>(() => {
    const { id } = route.params;
    return (id as string) || form._id || '';
  });

  const activeTabName = computed<string>(() => getTabName(router));

  const sidebarCollapsed = computed<boolean>(() => state.sidebarCollapsed);

  const actionsCollapsed = computed<boolean>(() => state.actionsCollapsed);

  const tabs = computed(() => {
    return state.tabs.map(tab => {
      return {
        ...tab,
        title: t(tab.title || ''),
        disabled: state.disabledTabKeys.includes(tab.id),
      };
    });
  });

  const contentContainerStyle = computed(() => {
    return {
      height: `calc(100% - var(--cl-nav-tabs-height) - 1px${navActions.value ? ' - ' + navActions.value.getHeight() : ''})`,
    };
  });

  const primaryRoutePath = computed<string>(() =>
    getRoutePathByDepth(route.path)
  );

  const afterSave = computed<Function[]>(() => state.afterSave);

  const getForm = debounce(async () => {
    if (!activeId.value) return;
    return await store.dispatch(`${ns}/getById`, activeId.value);
  });

  const onNavSidebarSelect = async (item: NavItem) => {
    if (!item) {
      console.error(new Error('item is empty'));
      return;
    }
    await router.push(
      `${primaryRoutePath.value}/${item.id}/${activeTabName.value}`
    );
    await getForm();
  };

  const onNavSidebarToggle = (value: boolean) => {
    if (value) {
      store.commit(`${ns}/collapseSidebar`);
    } else {
      store.commit(`${ns}/expandSidebar`);
    }
  };

  const onActionsToggle = () => {
    showActionsToggleTooltip.value = false;
    if (actionsCollapsed.value) {
      store.commit(`${ns}/expandActions`);
    } else {
      store.commit(`${ns}/collapseActions`);
    }
  };

  const onNavTabsSelect = async (tabName: string) => {
    await router.push(`${primaryRoutePath.value}/${activeId.value}/${tabName}`);
  };

  const onNavTabsToggle = () => {
    if (!sidebarCollapsed.value) {
      store.commit(`${ns}/collapseSidebar`);
    } else {
      store.commit(`${ns}/expandSidebar`);
    }
  };

  const onBack = async () => {
    await router.push(`${primaryRoutePath.value}`);
  };

  const onSave = async () => {
    if (!activeId.value) {
      console.error('Active id is empty');
      return;
    }
    await store.dispatch(`${ns}/updateById`, {
      id: activeId.value,
      form: state.form,
    });
    ElMessage.success(t('common.message.success.save'));
    await Promise.all([
      store.dispatch(`${ns}/getAllList`),
      store.dispatch(`${ns}/getById`, activeId.value),
    ]);

    // after save
    afterSave.value.map(fn => fn());
  };

  // get form when active id changes
  watch(() => activeId.value, getForm);

  // store context
  provide<DetailStoreContext<T>>('store-context', {
    namespace: ns,
    store,
    state,
  });

  return {
    navItems,
    activeId,
    navSidebar,
    navActions,
    showActionsToggleTooltip,
    tabs,
    activeTabName,
    sidebarCollapsed,
    actionsCollapsed,
    contentContainerStyle,
    getForm,
    onNavSidebarSelect,
    onNavSidebarToggle,
    onActionsToggle,
    onNavTabsSelect,
    onNavTabsToggle,
    onBack,
    onSave,
  };
};

export default useDetail;
