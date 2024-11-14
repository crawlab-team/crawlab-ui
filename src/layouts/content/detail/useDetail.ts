import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, watch, provide, ref } from 'vue';
import { getRoutePath, getTabName } from '@/utils/route';
import { ElMessage } from 'element-plus';
import { translate } from '@/utils/i18n';
import { debounce, isPro } from '@/utils';

// i18n
const t = translate;

const useDetail = <T extends BaseModel>(ns: ListStoreNamespace) => {
  const router = useRouter();
  const route = useRoute();

  // store state
  const store = useStore();
  const rootState = store.state as RootStoreState;
  const state = rootState[ns] as BaseStoreState;
  const commonState = rootState.common;

  const { form } = state;

  const showActionsToggleTooltip = ref<boolean>(false);

  const navItems = computed<NavItem<T>[]>(() =>
    state.allList.map((d: T) => {
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

  const tabs = computed(() => {
    return (
      state.tabs
        // filter tabs by allowed routes
        .filter(tab => {
          if (!isPro()) return true;
          if (!commonState.me) return false;
          if (commonState.me.root_admin) return true;
          const tabRoute = `${primaryRoutePath.value}/:id/${tab.id}`;
          return commonState.me.routes?.includes(tabRoute);
        })
        .map(tab => {
          return {
            ...tab,
            title: t(tab.title || ''),
            disabled: state.disabledTabKeys.includes(tab.id),
          };
        })
    );
  });

  const navLoading = ref(false);
  const onNavSelect = async (id: string) => {
    navLoading.value = true;
    try {
      await router.push(
        `${primaryRoutePath.value}/${id}/${activeTabName.value}`
      );
      await getForm();
    } finally {
      navLoading.value = false;
    }
  };

  const primaryRoutePath = computed<string>(() => getRoutePath(route.path));

  const afterSave = computed<Function[]>(() => state.afterSave);

  const getForm = debounce(async () => {
    if (!activeId.value) return;
    return await store.dispatch(`${ns}/getById`, activeId.value);
  });

  const onNavTabsSelect = async (tabName: string) => {
    await router.push(`${primaryRoutePath.value}/${activeId.value}/${tabName}`);
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
    await Promise.all([store.dispatch(`${ns}/getAllList`), getForm()]);

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
    showActionsToggleTooltip,
    navLoading,
    onNavSelect,
    tabs,
    activeTabName,
    getForm,
    onNavTabsSelect,
    onBack,
    onSave,
  };
};

export default useDetail;
