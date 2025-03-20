<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import ClChatConsole from '@/components/ui/chat/ChatConsole.vue';

const store = useStore();

const props = defineProps<{
  visible: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
  storeKey?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'resize', width: number): void;
  (e: 'resize-start'): void;
  (e: 'resize-end'): void;
}>();

// Resize functionality
const isResizing = ref(false);
const startX = ref(0);
const startWidth = ref(props.defaultWidth || 350);
const sidebarWidth = ref(props.defaultWidth || 350);

const onResizeStart = (e: MouseEvent) => {
  emit('resize-start');
  isResizing.value = true;
  startX.value = e.clientX;
  startWidth.value = sidebarWidth.value;
  document.addEventListener('mousemove', onResizeMove);
  document.addEventListener('mouseup', onResizeEnd);
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';
};

const onResizeMove = (e: MouseEvent) => {
  if (!isResizing.value) return;
  const deltaX = startX.value - e.clientX;
  const minWidth = props.minWidth || 250;
  const maxWidth = props.maxWidth || 600;
  const newWidth = Math.min(
    Math.max(startWidth.value + deltaX, minWidth),
    maxWidth
  );
  sidebarWidth.value = newWidth;

  // Emit resize event
  emit('resize', newWidth);

  // Update store if storeKey is provided
  if (props.storeKey) {
    store.commit(props.storeKey, newWidth);
  }

  // Store the width in localStorage if storageKey is provided
  if (props.storageKey) {
    localStorage.setItem(props.storageKey, newWidth.toString());
  }
};

const onResizeEnd = () => {
  emit('resize-end');
  isResizing.value = false;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', onResizeEnd);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// Initialize width from localStorage or store
onMounted(() => {
  let width: number | null = null;

  // Try to get width from localStorage
  if (props.storageKey) {
    const storedWidth = localStorage.getItem(props.storageKey);
    if (storedWidth) {
      width = parseInt(storedWidth);
    }
  }

  // Try to get width from store
  if (!width && props.storeKey) {
    width = store.state.layout.chatbotSidebarWidth;
  }

  // Update width if found
  if (width) {
    sidebarWidth.value = width;
    emit('resize', width);
  }
});

// Watch for store changes to sync with local state
watch(
  () => props.storeKey && store.state.layout.chatbotSidebarWidth,
  newWidth => {
    if (newWidth && newWidth !== sidebarWidth.value) {
      sidebarWidth.value = newWidth;
    }
  }
);

defineOptions({ name: 'ClChatSidebar' });
</script>

<template>
  <div
    class="chat-sidebar"
    :class="{ visible, resizing: isResizing }"
    :style="
      visible
        ? { width: `${sidebarWidth}px`, right: 0 }
        : { width: `${sidebarWidth}px`, right: `-${sidebarWidth}px` }
    "
  >
    <div class="resize-handle" @mousedown="onResizeStart"></div>
    <cl-chat-console :visible="visible" @close="emit('close')" />
  </div>
</template>

<style scoped>
.chat-sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  height: 100vh;
  background-color: var(--el-bg-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition:
    right 0.3s ease,
    width 0.3s ease;
  z-index: 2000;
  border-left: 1px solid var(--el-border-color);
}

/* Disable width transition during resize */
.chat-sidebar.resizing {
  transition: right 0.3s ease;
}

.chat-sidebar.visible {
  right: 0;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;
  z-index: 2001;
}

.resize-handle:hover {
  background-color: var(--el-border-color-light);
}
</style>
