<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import logoWithTitle from '@/assets/svg/logo-white.svg?url';
import logoIcon from '@/assets/svg/logo-icon-white.svg?url';
import {
  getAllMenuItemPathMap,
  getPrimaryPath,
  isPro,
  translate,
} from '@/utils';

const t = translate;

const router = useRouter();

const route = useRoute();

const store = useStore();

const {
  common: commonState,
  layout: layoutState,
  system: systemState,
} = store.state as RootStoreState;

const storeNamespace = 'layout';

const sidebarCollapsed = computed<boolean>(() => layoutState.sidebarCollapsed);

const menuItems = computed<MenuItem[]>(
  () => store.getters['layout/sidebarMenuItems']
);

const allMenuItemPathMap = computed<Map<string, string>>(() =>
  getAllMenuItemPathMap()
);

const activePath = computed<string>(() => {
  if (allMenuItemPathMap.value.has(route.path)) {
    return route.path;
  }
  return getPrimaryPath(route.path);
});

const openedIndexes = computed<string[]>(() => {
  const parentPath = allMenuItemPathMap.value.get(activePath.value);
  if (!parentPath) return [];
  return [parentPath];
});

const onMenuItemClick = (_: string, indexPath: string[]) => {
  if (indexPath) router.push(indexPath?.[indexPath?.length - 1]);
};

const toggleSidebar = () => {
  store.commit(
    `${storeNamespace}/setSidebarCollapsed`,
    !sidebarCollapsed.value
  );
};

const systemInfo = computed<SystemInfo>(() => commonState.systemInfo || {});

const customize = computed<Setting>(() => systemState.settings.customize);
const showCustomTitle = computed<boolean>(
  () => customize.value?.value?.show_custom_title
);
const showCustomLogo = computed<boolean>(
  () => customize.value?.value?.show_custom_logo
);
const hidePlatformVersion = computed<boolean>(
  () => customize.value?.value?.hide_platform_version
);
const customTitle = computed<string>(
  () => customize.value?.value?.custom_title
);
const customLogo = computed<string>(() => customize.value?.value?.custom_logo);

const customizedLogo = computed<string>(() => {
  if (showCustomLogo.value && customLogo.value) {
    return customLogo.value;
  }
  return logoIcon;
});

onBeforeMount(async () => {
  if (isPro()) {
    await store.dispatch('system/getSetting', { key: 'customize' });
  }
});

defineOptions({ name: 'ClSidebar' });
</script>

<template>
  <el-aside
    :class="sidebarCollapsed ? 'collapsed' : ''"
    class="sidebar"
    width="inherit"
  >
    <!-- Logo -->
    <div class="sidebar-header">
      <div v-if="!sidebarCollapsed" class="logo">
        <div class="logo">
          <img
            class="logo-img"
            alt="logo-img"
            :src="
              showCustomTitle || showCustomLogo ? customizedLogo : logoWithTitle
            "
          />

          <div v-if="showCustomTitle || showCustomLogo" class="logo-title">
            <template v-if="showCustomTitle && customTitle">
              {{ customTitle }}
            </template>
            <template v-else> Crawlab</template>
          </div>

          <div v-if="!hidePlatformVersion" class="logo-sub-title">
            <div class="logo-sub-title-block">
              <span>{{ t(systemInfo.edition || '') }}</span>
              <cl-icon v-if="isPro()" :icon="['far', 'gem']" />
            </div>
            <div class="logo-sub-title-block">
              <span>{{ systemInfo.version }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="logo">
        <img
          class="logo-img"
          alt="logo-img"
          :src="showCustomLogo ? customizedLogo : logoIcon"
        />
      </div>
    </div>

    <!-- Sidebar Menu -->
    <div class="sidebar-menu">
      <el-menu
        :collapse="sidebarCollapsed"
        active-text-color="var(--cl-menu-active-text)"
        background-color="var(--cl-menu-bg)"
        text-color="var(--cl-menu-text)"
        :default-active="activePath"
        :default-openeds="openedIndexes"
        @select="onMenuItemClick"
      >
        <template v-for="item in menuItems">
          <cl-sidebar-item :item="item" />
        </template>
      </el-menu>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="el-menu-item" @click="toggleSidebar">
        <el-tooltip
          :content="
            sidebarCollapsed
              ? t('layouts.components.sidebar.expand')
              : t('layouts.components.sidebar.collapse')
          "
          :disabled="!sidebarCollapsed"
        >
          <div class="toggle-wrapper">
            <cl-menu-item-icon
              :item="{
                title: sidebarCollapsed
                  ? t('layouts.components.sidebar.expand')
                  : t('layouts.components.sidebar.collapse'),
                icon: sidebarCollapsed
                  ? ['fa', 'angles-right']
                  : ['fa', 'angles-left'],
              }"
            />
            <span v-if="!sidebarCollapsed" class="menu-item-title">
              {{
                sidebarCollapsed
                  ? t('layouts.components.sidebar.expand')
                  : t('layouts.components.sidebar.collapse')
              }}
            </span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </el-aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--cl-sidebar-width);
  height: 100vh;
  overflow: hidden;
  user-select: none;
  background-color: var(--cl-menu-bg);
  z-index: 20; /* Higher than other components to ensure it's always visible */
  transition: width var(--cl-sidebar-collapse-transition-duration);

  &.collapsed {
    width: var(--cl-sidebar-width-collapsed);
    
    .sidebar-header,
    .sidebar-menu,
    .sidebar-footer {
      width: var(--cl-sidebar-width-collapsed);
    }

    .sidebar-header,
    .sidebar-footer {
      padding: 0;
      display: flex;
      justify-content: center;
    }
  }

  .sidebar-header {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    height: var(--cl-header-height);
    width: var(--cl-sidebar-width);
    padding-left: 12px;
    padding-right: 20px;
    border-right: none;
    background-color: var(--cl-menu-bg);
    transition: width var(--cl-sidebar-collapse-transition-duration);

    .logo {
      display: flex;
      align-items: center;
      height: 100%;

      .logo-img {
        height: 32px;
      }

      .logo-title {
        font-family:
          BlinkMacSystemFont,
          -apple-system,
          segoe ui,
          roboto,
          oxygen,
          ubuntu,
          cantarell,
          fira sans,
          droid sans,
          helvetica neue,
          helvetica,
          arial,
          sans-serif;
        font-size: 20px;
        font-weight: 600;
        margin-left: 12px;
        color: #ffffff;
      }

      .logo-sub-title {
        font-family:
          BlinkMacSystemFont,
          -apple-system,
          segoe ui,
          roboto,
          oxygen,
          ubuntu,
          cantarell,
          fira sans,
          droid sans,
          helvetica neue,
          helvetica,
          arial,
          sans-serif;
        font-size: 10px;
        height: 24px;
        line-height: 24px;
        margin-left: 10px;
        font-weight: 500;
        color: var(--cl-menu-text);

        .logo-sub-title-block {
          display: flex;
          align-items: center;
          height: 12px;
          line-height: 12px;

          &:deep(.icon) {
            margin-left: 3px;
          }
        }
      }
    }
  }

  .sidebar-menu {
    position: absolute;
    top: var(--cl-header-height);
    left: 0;
    overflow-y: auto;
    width: var(--cl-sidebar-width);
    height: calc(100vh - var(--cl-header-height) - 56px);
    margin: 0;
    padding: 0;
    transition: width var(--cl-sidebar-collapse-transition-duration);

    .el-menu {
      border-right: none;
      width: 100%;
      height: calc(100vh - var(--cl-header-height));
      transition: none !important;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &:hover::-webkit-scrollbar {
      display: block;
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--cl-menu-bg);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--cl-sub-menu-bg);
      border-radius: 3px;
    }
  }

  .sidebar-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 56px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.2);

    .el-menu-item {
      width: var(--cl-sidebar-width);
      color: var(--cl-menu-text);

      &:hover {
        background-color: var(--cl-menu-hover);
      }

      .toggle-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;

        .menu-item-title {
          margin-left: 6px;
        }
      }
    }
  }
}

.sidebar-toggle {
  position: fixed;
  top: 0;
  left: var(--cl-sidebar-width);
  display: inline-flex;
  align-items: center;
  width: 18px;
  height: 64px;
  z-index: 5;
  color: var(--cl-menu-bg);
  font-size: 24px;
  margin-left: 10px;
  cursor: pointer;
  transition: left var(--cl-sidebar-collapse-transition-duration);

  &.collapsed {
    left: var(--cl-sidebar-width-collapsed);
  }
}
</style>
