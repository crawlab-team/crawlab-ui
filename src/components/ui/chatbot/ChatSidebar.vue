<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

const { t } = useI18n();
const store = useStore();

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'toggle'): void;
}>();

// Resize functionality
const isResizing = ref(false);
const startX = ref(0);
const startWidth = ref(350); // Default width
const sidebarWidth = ref(350);

const onResizeStart = (e: MouseEvent) => {
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
  const newWidth = Math.min(Math.max(startWidth.value + deltaX, 250), 600); // Limit width between 250px and 600px
  sidebarWidth.value = newWidth;

  // Update the store state to ensure main container adjusts
  store.commit('layout/setChatbotSidebarWidth', newWidth);

  // Store the width in localStorage for persistence
  localStorage.setItem('chatbotSidebarWidth', newWidth.toString());
};

const onResizeEnd = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', onResizeEnd);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// Initialize width from localStorage
onMounted(() => {
  const storedWidth = localStorage.getItem('chatbotSidebarWidth');
  if (storedWidth) {
    const width = parseInt(storedWidth);
    sidebarWidth.value = width;

    // Also update the store to ensure consistency
    store.commit('layout/setChatbotSidebarWidth', width);
  }
});

// Watch for store changes to sync with local state
watch(
  () => store.state.layout.chatbotSidebarWidth,
  newWidth => {
    if (newWidth !== sidebarWidth.value) {
      sidebarWidth.value = newWidth;
    }
  }
);

const toggleSidebar = () => {
  emit('toggle');
};

type ChatMessageType = {
  role: 'system' | 'user';
  content: string;
  timestamp: Date;
};

// Mock chat history
const chatHistory = reactive<ChatMessageType[]>([
  {
    role: 'system',
    content: "Hello! I'm Crawlab AI assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 60000),
  },
]);

// Function to handle sending a message
const sendMessage = (message: string) => {
  // Add user message to chat history
  chatHistory.push({
    role: 'user',
    content: message,
    timestamp: new Date(),
  });

  // Mock AI response with a slight delay to simulate processing
  setTimeout(() => {
    // Add AI response to chat history
    chatHistory.push({
      role: 'system',
      content: getMockResponse(message),
      timestamp: new Date(),
    });
  }, 1000);
};

// Mock responses based on user query
const getMockResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('spider') || lowerQuery.includes('crawler')) {
    return 'Spiders are web crawlers in Crawlab that gather data from websites. You can create and manage them in the Spider section of the sidebar.';
  } else if (lowerQuery.includes('task') || lowerQuery.includes('schedule')) {
    return 'Tasks are individual crawler runs. You can schedule tasks to run at specific times using the Schedules feature.';
  } else if (lowerQuery.includes('node') || lowerQuery.includes('worker')) {
    return 'Nodes are the servers running Crawlab. A node can be a master or worker. Workers execute the tasks distributed by the master.';
  } else if (lowerQuery.includes('data') || lowerQuery.includes('result')) {
    return 'Crawled data is stored in the database and can be viewed in the Results section of each spider.';
  } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return "Hello! I'm the Crawlab AI assistant. I can help you with questions about using Crawlab.";
  } else {
    return "I don't have specific information about that yet. As a prototype, my knowledge is limited. Please try asking about spiders, tasks, nodes, or data in Crawlab.";
  }
};

defineOptions({ name: 'ClChatSidebar' });
</script>

<template>
  <div
    class="chat-sidebar"
    :class="{ visible: visible }"
    :style="visible ? { width: `${sidebarWidth}px`, right: 0 } : {}"
  >
    <div class="resize-handle" @mousedown="onResizeStart"></div>
    <div class="sidebar-header">
      <div class="left-content">
        <el-button
          v-if="visible"
          type="primary"
          @click="toggleSidebar"
          class="chat-toggle-btn is-active"
        >
          <cl-icon :icon="['fa', 'comment-dots']" />
          <span class="button-text">{{
            t('components.ai.chatbot.button')
          }}</span>
          <cl-icon :icon="['fa', 'angles-right']" class="toggle-indicator" />
        </el-button>
        <h3 v-else>{{ t('components.ai.chatbot.title') }}</h3>
      </div>
      <el-button type="text" @click="emit('close')" class="close-btn">
        <cl-icon :icon="['fas', 'times']" />
      </el-button>
    </div>

    <div class="chat-messages">
      <chat-message
        v-for="(message, index) in chatHistory"
        :key="index"
        :message="message"
      />
    </div>

    <chat-input @send="sendMessage" />
  </div>
</template>

<style scoped>
.chat-sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background-color: var(--el-bg-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition:
    right 0.3s ease,
    width 0.3s ease;
  z-index: 2000;
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

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.left-content {
  display: flex;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
}

.close-btn {
  padding: 6px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--el-bg-color-page);
}

.chat-toggle-btn {
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 8px 16px;
  animation: fadeIn 0.3s ease-in-out;
}

.chat-toggle-btn .button-text {
  margin: 0 8px;
  display: inline-block;
}

.chat-toggle-btn .toggle-indicator {
  margin-left: 4px;
  transition: transform 0.3s;
}

.chat-toggle-btn.is-active {
  background-color: var(--el-color-primary-dark-2);
}

.chat-toggle-btn.is-active .toggle-indicator {
  transform: rotate(180deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
