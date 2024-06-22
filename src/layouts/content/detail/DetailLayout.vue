<script setup lang="ts">
defineOptions({ name: 'ClDetailLayout' });
import { computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import useDetail from '@/layouts/content/detail/useDetail';
import { useStore } from 'vuex';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    storeNamespace: ListStoreNamespace;
    noSidebar: boolean;
    navItemNameKey: string;
    showBackButton: boolean;
    showSaveButton: boolean;
    tabs?: NavItem[];
  }>(),
  {
    noSidebar: false,
    navItemNameKey: 'name',
    showSaveButton: true,
    showBackButton: true,
  }
);

const t = translate;

const IGNORE_GET_ALL_NS = ['task'];

const ns = computed(() => props.storeNamespace);
const store = useStore();
const state = store.state[ns.value] as BaseStoreState;

const computedNavItems = computed<NavItem[]>(() =>
  state.allList.map((d: BaseModel) => {
    const { navItemNameKey } = props;
    return {
      id: d._id,
      title: d[navItemNameKey],
    } as NavItem;
  })
);

const {
  activeId,
  activeTabName,
  navSidebar,
  getForm,
  sidebarCollapsed,
  actionsCollapsed,
  showActionsToggleTooltip,
  tabs: defaultTabs,
  contentContainerStyle,
  onNavSidebarSelect,
  onNavSidebarToggle,
  onNavTabsSelect,
  onNavTabsToggle,
  onActionsToggle,
  onBack,
  onSave,
} = useDetail(ns.value);

// get form before mount
onBeforeMount(getForm);

// get all list before mount
onBeforeMount(async () => {
  if (IGNORE_GET_ALL_NS.includes(ns.value)) return;
  await store.dispatch(`${ns.value}/getAllList`);
});

// scroll nav sidebar after mounted
onMounted(() => {
  if (!navSidebar.value) return;
  navSidebar.value.scroll(activeId.value);
});

// reset form before unmount
onBeforeUnmount(() => {
  if (!activeTabName.value) {
    store.commit(`${ns.value}/resetForm`);
  }
});
</script>

<template>
  <div
    :class="noSidebar || sidebarCollapsed ? 'collapsed' : ''"
    class="detail-layout"
  >
    <div class="sidebar">
      <cl-nav-sidebar
        v-if="!noSidebar"
        ref="navSidebar"
        :active-key="activeId"
        :collapsed="noSidebar || sidebarCollapsed"
        :items="computedNavItems"
        @select="onNavSidebarSelect"
        @toggle="onNavSidebarToggle"
      />
    </div>
    <div class="content">
      <cl-nav-tabs
        :active-key="activeTabName"
        :items="tabs || defaultTabs"
        :collapsed="sidebarCollapsed"
        toggle
        class="nav-tabs"
        @select="onNavTabsSelect"
        @toggle="onNavTabsToggle"
      >
        <template #extra>
          <el-tooltip
            v-model="showActionsToggleTooltip"
            :content="
              actionsCollapsed
                ? t('layouts.detailLayout.navTabs.toggle.tooltip.expand')
                : t('layouts.detailLayout.navTabs.toggle.tooltip.collapse')
            "
          >
            <div
              :class="actionsCollapsed ? 'collapsed' : ''"
              class="actions-toggle"
              @click="onActionsToggle"
            >
              <font-awesome-icon :icon="['fa', 'angle-up']" class="icon" />
            </div>
          </el-tooltip>
        </template>
      </cl-nav-tabs>
      <cl-nav-actions
        ref="navActions"
        :collapsed="actionsCollapsed"
        class="nav-actions"
      >
        <cl-nav-action-group-detail-common
          :show-back-button="showBackButton"
          :show-save-button="showSaveButton"
          @back="onBack"
          @save="onSave"
        />
        <slot name="actions" />
      </cl-nav-actions>
      <div :style="contentContainerStyle" class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-layout {
  display: flex;
  height: 100%;

  &.collapsed {
    .sidebar {
      flex: 0 0 0;
    }

    .content {
      flex: 1 0 100%;
      max-width: 100%;
    }
  }

  .sidebar {
    flex: 0 0 var(--cl-nav-sidebar-width);
    width: 0;
    transition: flex var(--cl-nav-sidebar-collapse-transition-duration);
    border-right: 1px solid var(--cl-info-plain-color);
    background-color: #ffffff;
  }

  .content {
    flex: 1 0 calc(100% - var(--cl-nav-sidebar-width));
    width: var(--cl-nav-sidebar-width);
    max-width: calc(100% - var(--cl-nav-sidebar-width));
    background-color: var(--cl-container-white-bg);
    display: flex;
    flex-direction: column;

    .nav-actions {
      height: fit-content;
    }

    .content-container {
      flex: 1;
    }
  }

  .actions-toggle {
    display: flex;
    align-items: center;
    height: var(--cl-nav-tabs-height);
    color: var(--cl-info-color);
    cursor: pointer;
    padding: 0 20px;
    border-left: 1px solid var(--cl-container-border-color);

    .icon {
      transition: all var(--cl-default-transition-duration);
    }

    &.collapsed {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
