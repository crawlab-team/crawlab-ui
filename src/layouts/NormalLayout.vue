<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const { layout: state } = store.state as RootStoreState;

const sidebarCollapsed = computed<boolean>(() => state.sidebarCollapsed);
defineOptions({ name: 'ClNormalLayout' });
</script>

<template>
  <el-container class="normal-layout">
    <cl-sidebar />
    <el-container
      :class="sidebarCollapsed ? 'collapsed' : ''"
      class="container"
    >
      <cl-header />
      <cl-tabs-view />
      <div class="container-body">
        <router-view />
      </div>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.normal-layout {
  height: 100vh;

  .container {
    position: fixed;
    top: 0;
    left: var(--cl-sidebar-width);
    display: flex;
    flex-direction: column;
    width: calc(100vw - var(--cl-sidebar-width));
    height: 100vh;
    transition: left var(--cl-sidebar-collapse-transition-duration);
    z-index: 2;

    &.collapsed {
      left: var(--cl-sidebar-width-collapsed);
      width: calc(100vw - var(--cl-sidebar-width-collapsed));
    }

    .container-body {
      background-color: var(--cl-container-bg);
      height: calc(
        100vh - var(--cl-header-height) - var(--cl-tabs-view-height)
      );
      width: 100%;
      overflow: auto;
    }
  }
}
</style>
