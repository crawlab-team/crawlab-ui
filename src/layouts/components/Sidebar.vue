<script setup lang="ts">
defineOptions({ name: 'ClSidebar' });
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import logo from '@/assets/svg/logo-white.svg';
import logoIcon from '@/assets/svg/logo-icon-white.svg';
import { getPrimaryPath } from '@/utils/path';
import { useI18n } from 'vue-i18n';
import urljoin from 'url-join';

const router = useRouter();

const route = useRoute();

const { t } = useI18n();

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

const getMenuItemPathMap = (
  rootPath: string,
  item: MenuItem
): Map<string, string> => {
  const paths = new Map<string, string>();
  const itemPath = item.path?.startsWith('/')
    ? item.path
    : urljoin(rootPath, item.path || '');
  paths.set(itemPath, rootPath);
  if (item.children && item.children.length > 0) {
    for (const subItem of item.children) {
      getMenuItemPathMap(itemPath, subItem).forEach((parentPath, path) => {
        paths.set(path, parentPath);
      });
    }
  }
  return paths;
};

const allMenuItemPathMap = computed<Map<string, string>>(() => {
  const paths = new Map<string, string>();
  for (const item of menuItems.value) {
    getMenuItemPathMap('/', item).forEach((parentPath, path) => {
      paths.set(path, parentPath);
    });
  }
  return paths;
});

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
    `${storeNamespace}/setSideBarCollapsed`,
    !sidebarCollapsed.value
  );
};

const systemInfo = computed<SystemInfo>(() => commonState.systemInfo || {});

const siteTitle = computed<Setting>(() => systemState.siteTitle);
</script>

<template>
  <span
    :class="sidebarCollapsed ? 'collapsed' : ''"
    class="sidebar-toggle"
    @click="toggleSidebar"
    v-track="'click_sidebar_toggle'"
  >
    <font-awesome-icon v-if="!sidebarCollapsed" :icon="['fas', 'outdent']" />
    <font-awesome-icon v-else :icon="['fas', 'indent']" />
  </span>
  <el-aside
    :class="sidebarCollapsed ? 'collapsed' : ''"
    class="sidebar"
    width="inherit"
  >
    <!-- Logo -->
    <div class="logo-container">
      <div v-if="!sidebarCollapsed" class="logo">
        <div
          v-if="
            !siteTitle.value?.customize_site_title ||
            !siteTitle.value?.site_title
          "
          class="logo"
        >
          <img class="logo-img" alt="logo-img" :src="logo" />
          <div class="logo-sub-title">
            <div class="logo-sub-title-block">
              {{ t(systemInfo.edition || '') }}
            </div>
            <div class="logo-sub-title-block">
              {{ systemInfo.version }}
            </div>
          </div>
        </div>
        <div v-else class="logo-title">
          {{ siteTitle.value?.site_title }}
        </div>
      </div>
      <div v-else class="logo">
        <img class="logo-img" alt="logo-img" :src="logoIcon" />
      </div>
    </div>
    <!-- ./Logo -->

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
        <template v-for="item in menuItems" :key="$index">
          <cl-sidebar-item :item="item" />
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>

<style lang="scss" scoped>
.sidebar {
  overflow-x: hidden;
  user-select: none;
  background-color: var(--cl-menu-bg);

  &.collapsed {
    .logo-container,
    .sidebar-menu {
      width: var(--cl-sidebar-width-collapsed);
    }

    .logo-container {
      padding: 0;
      display: flex;
      justify-content: center;
    }
  }

  .logo-container {
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
        }
      }
    }
  }

  .sidebar-menu {
    width: var(--cl-sidebar-width);
    height: calc(100vh - var(--cl-header-height));
    margin: 0;
    padding: 0;
    transition: width var(--cl-sidebar-collapse-transition-duration);

    .el-menu {
      border-right: none;
      width: inherit !important;
      height: calc(100vh - var(--cl-header-height));
      transition: none !important;
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
