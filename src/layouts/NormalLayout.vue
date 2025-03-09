<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const { layout: state } = store.state as RootStoreState;

const sidebarCollapsed = computed<boolean>(() => state.sidebarCollapsed);
const chatSidebarVisible = computed<boolean>(() => state.chatbotSidebarVisible);

onBeforeMount(() => {
  store.dispatch('common/getMe');
});

defineOptions({ name: 'ClNormalLayout' });
</script>

<template>
  <div class="normal-layout">
    <cl-sidebar />
    <div 
      :class="[sidebarCollapsed ? 'collapsed' : '', chatSidebarVisible ? 'chat-visible' : '']" 
      class="main-content"
    >
      <cl-header />
      <cl-tabs-view />
      <div class="container-body">
        <router-view />
      </div>
    </div>
    <cl-chat-sidebar />
  </div>
</template>

<style scoped>
.normal-layout {
  height: 100vh;
  
  .main-content {
    position: fixed;
    top: 0;
    left: var(--cl-sidebar-width);
    right: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    transition: left var(--cl-sidebar-collapse-transition-duration), right 0.3s ease;
    z-index: 2;

    &.collapsed {
      left: var(--cl-sidebar-width-collapsed);
    }
    
    &.chat-visible {
      right: 350px; /* Width of the chat sidebar */
    }

    .container-body {
      background-color: var(--cl-container-bg);
      height: calc(
        100vh - var(--cl-header-height) - var(--cl-tabs-view-height)
      );
      overflow: auto;
      flex: 1;
    }
  }
}
</style>
