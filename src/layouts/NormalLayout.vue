<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import ClChatSidebar from '@/components/ui/chat/ChatSidebar.vue';

const store = useStore();
const { layout: state } = store.state as RootStoreState;

const sidebarCollapsed = computed<boolean>(() => state.sidebarCollapsed);
const chatSidebarVisible = computed<boolean>(() => state.chatbotSidebarVisible);
const chatSidebarWidth = computed<number>(() => state.chatbotSidebarWidth);

const closeChatSidebar = () => {
  store.commit('layout/setChatbotSidebarVisible', false);
};

const resizeChatSidebar = (width: number) => {
  store.commit('layout/setChatbotSidebarWidth', width);
};

const chatSidebarResizing = ref(false);

// Make sure the chatbotSidebarWidth is initialized from localStorage
onBeforeMount(() => {
  store.dispatch('common/getMe');

  // Ensure sidebar width is initialized from localStorage
  const storedWidth = localStorage.getItem('chatbotSidebarWidth');
  if (storedWidth) {
    const width = parseInt(storedWidth);
    store.commit('layout/setChatbotSidebarWidth', width);
  }
});

defineOptions({ name: 'ClNormalLayout' });
</script>

<template>
  <div class="normal-layout">
    <cl-sidebar />
    <div
      :class="[
        sidebarCollapsed ? 'collapsed' : '',
        chatSidebarResizing ? 'chat-resizing' : '',
      ]"
      class="main-content"
      :style="chatSidebarVisible ? { right: `${chatSidebarWidth}px` } : {}"
    >
      <cl-header />
      <cl-tabs-view />
      <div class="container-body">
        <router-view />
      </div>
    </div>
    <cl-chat-sidebar
      :visible="chatSidebarVisible"
      :default-width="chatSidebarWidth"
      @close="closeChatSidebar"
      @resize="resizeChatSidebar"
      @resize-start="chatSidebarResizing = true"
      @resize-end="chatSidebarResizing = false"
    />
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
    z-index: 2;

    &:not(.chat-resizing) {
      transition:
        left var(--cl-sidebar-collapse-transition-duration),
        right 0.3s ease;
    }

    &.collapsed {
      left: var(--cl-sidebar-width-collapsed);
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
