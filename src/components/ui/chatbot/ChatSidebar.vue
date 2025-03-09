<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import ChatbotConfigDialog from './ChatbotConfigDialog.vue';
import { llmService } from '@/services';

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
  
  // Load chatbot configuration if available
  loadChatbotConfig();
  // Load available LLM providers
  loadLLMProviders();
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

// Chatbot configuration
interface ChatbotConfig {
  llmProvider: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

const chatbotConfig = ref<ChatbotConfig>({
  llmProvider: 'openai',
  model: 'gpt-3.5-turbo',
  systemPrompt: 'You are a helpful AI assistant for Crawlab, a web crawling and data extraction platform.',
  temperature: 0.7,
  maxTokens: 1000,
});

// Available LLM providers
const availableProviders = ref<llmService.LLMProvider[]>([]);

// Loading state for chat
const isLoading = ref(false);
const streamError = ref('');

// Load configuration from localStorage
const loadChatbotConfig = () => {
  const storedConfig = localStorage.getItem('chatbotConfig');
  if (storedConfig) {
    try {
      const parsedConfig = JSON.parse(storedConfig);
      chatbotConfig.value = { ...chatbotConfig.value, ...parsedConfig };
    } catch (e) {
      console.error('Failed to parse stored chatbot config', e);
    }
  }
};

// Load available LLM providers
const loadLLMProviders = async () => {
  try {
    availableProviders.value = await llmService.getLLMProviders();
  } catch (error) {
    console.error('Failed to load LLM providers:', error);
  }
};

// Initialize chat history with welcome message
const chatHistory = reactive<ChatMessageType[]>([
  {
    role: 'system',
    content: "Hello! I'm Crawlab AI assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 60000),
  },
]);

// Function to handle sending a message
const sendMessage = async (message: string) => {
  if (!message.trim()) return;
  
  // Reset any previous errors
  streamError.value = '';
  
  // Add user message to chat history
  chatHistory.push({
    role: 'user',
    content: message,
    timestamp: new Date(),
  });

  // Add a placeholder for the AI response
  const responseIndex = chatHistory.length;
  chatHistory.push({
    role: 'system',
    content: "",
    timestamp: new Date(),
  });

  // Set loading state
  isLoading.value = true;

  try {
    // Check if streaming is supported
    const supportsStreaming = await checkStreamingSupport();
    
    if (supportsStreaming) {
      // Use streaming API
      await sendStreamingRequest(message, responseIndex);
    } else {
      // Use regular API
      await sendRegularRequest(message, responseIndex);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    streamError.value = error instanceof Error ? error.message : 'An error occurred while sending your message';
    
    // Update response with error
    if (chatHistory[responseIndex]) {
      chatHistory[responseIndex].content = "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Check if the selected provider supports streaming
const checkStreamingSupport = async (): Promise<boolean> => {
  try {
    const { llmProvider, apiKey } = chatbotConfig.value;
    const config = apiKey ? { api_key: apiKey } : undefined;
    return await llmService.checkProviderFeatureSupport(llmProvider, 'streaming', config);
  } catch (error) {
    console.error('Error checking streaming support:', error);
    return false; // Default to non-streaming if check fails
  }
};

// Send a request using streaming
const sendStreamingRequest = async (message: string, responseIndex: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const { llmProvider, model, systemPrompt, temperature, maxTokens, apiKey } = chatbotConfig.value;
    
    const config: Record<string, string> = {};
    if (apiKey) {
      config.api_key = apiKey;
    }

    // Create prompt with system message and user query
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    
    const chatRequest: llmService.ChatRequest = {
      provider: llmProvider,
      config,
      model,
      prompt,
      temperature,
      max_tokens: maxTokens,
    };

    let fullResponse = "";
    
    llmService.sendStreamingChatRequest(
      chatRequest,
      (chunk) => {
        // Update the response text with each chunk
        fullResponse += chunk.text;
        chatHistory[responseIndex].content = fullResponse;
      },
      (error) => {
        // Handle streaming error
        streamError.value = error instanceof Error ? error.message : 'Streaming error';
        reject(error);
      },
      () => {
        // Streaming complete
        resolve();
      }
    );
  });
};

// Send a request using non-streaming API
const sendRegularRequest = async (message: string, responseIndex: number): Promise<void> => {
  const { llmProvider, model, systemPrompt, temperature, maxTokens, apiKey } = chatbotConfig.value;
  
  const config: Record<string, string> = {};
  if (apiKey) {
    config.api_key = apiKey;
  }

  // Create prompt with system message and user query
  const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
  
  const chatRequest: llmService.ChatRequest = {
    provider: llmProvider,
    config,
    model,
    prompt,
    temperature,
    max_tokens: maxTokens,
  };

  // Send the chat request
  const response = await llmService.sendChatRequest(chatRequest);
  
  // Update the chat history with the response
  chatHistory[responseIndex].content = response.text;
};

// Configuration dialog
const configDialogVisible = ref(false);

const openConfig = () => {
  configDialogVisible.value = true;
};

// Handle configuration updates
const handleConfigUpdate = (config: ChatbotConfig) => {
  chatbotConfig.value = config;
  configDialogVisible.value = false;
  
  // Save configuration to localStorage
  localStorage.setItem('chatbotConfig', JSON.stringify(config));
  
  // Add a message to inform the user of the update
  chatHistory.push({
    role: 'system',
    content: `AI assistant configuration updated. Using ${config.llmProvider} with model ${config.model}.`,
    timestamp: new Date(),
  });
};

const openAdd = () => {
  console.log('open add');
};

const openHistory = () => {
  console.log('open history');
};

defineOptions({ name: 'ClChatSidebar' });
</script>

<template>
  <div class="chat-sidebar" :class="{ visible: visible }"
    :style="visible ? { width: `${sidebarWidth}px`, right: 0 } : {}">
    <div class="resize-handle" @mousedown="onResizeStart"></div>
    <div class="sidebar-header">
      <div class="left-content">
        <el-button v-if="visible" type="primary" @click="toggleSidebar" class="chat-toggle-btn is-active">
          <cl-icon :icon="['fa', 'comment-dots']" />
          <span class="button-text">{{
            t('components.ai.chatbot.button')
            }}</span>
          <cl-icon :icon="['fa', 'angles-right']" class="toggle-indicator" />
        </el-button>
        <h3 v-else>{{ t('components.ai.chatbot.title') }}</h3>

      </div>
      <div class="right-content">
        <el-tooltip :content="t('components.ai.chatbot.add')">
          <el-button type="text" @click="openAdd" class="add-btn">
            <cl-icon :icon="['fas', 'plus']" />
          </el-button>
        </el-tooltip>
        <el-tooltip :content="t('components.ai.chatbot.history')">
          <el-button type="text" @click="openHistory" class="history-btn">
            <cl-icon :icon="['fas', 'history']" />
          </el-button>
        </el-tooltip>
        <el-tooltip :content="t('components.ai.chatbot.config.title')">
          <el-button type="text" @click="openConfig" class="config-btn">
            <cl-icon :icon="['fas', 'cog']" />
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="chat-messages">
      <chat-message v-for="(message, index) in chatHistory" :key="index" :message="message" />
      <div v-if="streamError" class="stream-error">
        <el-alert type="error" :title="streamError" show-icon />
      </div>
    </div>

    <chat-input @send="sendMessage" :is-loading="isLoading" />
    
    <!-- Config Dialog -->
    <chatbot-config-dialog 
      :visible="configDialogVisible"
      :providers="availableProviders"
      :current-config="chatbotConfig"
      @close="configDialogVisible = false"
      @confirm="handleConfigUpdate"
    />
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
  border-left: 1px solid var(--el-border-color);
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
  background-color: var(--el-color-white);
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
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.stream-error {
  margin: 10px;
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
