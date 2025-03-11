<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import ChatbotConfigDialog from './ChatbotConfigDialog.vue';
import useRequest from '@/services/request';
import { getRequestBaseUrl } from '@/utils';
import { debounce } from 'lodash';

const { t } = useI18n();

const store = useStore();

const { get } = useRequest();

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

const chatbotConfig = ref<ChatbotConfig>({
  systemPrompt:
    'You are a helpful AI assistant for Crawlab, a web crawling and data extraction platform.',
  temperature: 0.7,
  maxTokens: 1000,
});

// Available LLM providers and models
const availableProviders = ref<LLMProvider[]>([]);

// Loading state for chat
const isLoading = ref(false);
const streamError = ref('');

// Add AbortController for cancelling requests
const abortController = ref<AbortController | null>(null);

// Add a function to extract error messages from various formats
const extractErrorMessage = (errorData: string): string => {
  try {
    // Try to parse the error data as JSON
    const parsed = JSON.parse(errorData);

    // First check for structured error_detail with message
    if (parsed.error_detail && parsed.error_detail.message) {
      return parsed.error_detail.message;
    }
    
    // Fall back to the error property
    if (parsed.error) {
      return typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
    }
    
    // Alternative: check for text field (some providers include human-readable messages)
    if (parsed.text && parsed.text.startsWith('Error:')) {
      return parsed.text;
    }

    // If it's an object but doesn't have error property, stringify it nicely
    if (typeof parsed === 'object') {
      return JSON.stringify(parsed, null, 2);
    }

    // If parsing succeeded but didn't give us a useful error, return the original
    return errorData;
  } catch (e) {
    // If it's not valid JSON, just return the original string
    return errorData;
  }
};

// Updated API call functions
const loadLLMProviders = debounce(async () => {
  try {
    const res = await get('/ai/llm/providers', {
      available: true,
    });

    availableProviders.value = res.data || [];

    if (chatbotConfig.value.provider && chatbotConfig.value.model) {
      return;
    }

    if (availableProviders.value.length > 0) {
      chatbotConfig.value.provider = availableProviders.value[0].key!;
      chatbotConfig.value.model = availableProviders.value[0].models![0];
      localStorage.setItem(
        'chatbotConfig',
        JSON.stringify(chatbotConfig.value)
      );
    }
  } catch (error) {
    console.error('Failed to load LLM providers:', error);
  }
});
onBeforeMount(loadLLMProviders);
watch(
  () => props.visible,
  () => {
    if (props.visible) {
      loadLLMProviders();
    }
  }
);

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
onBeforeMount(loadChatbotConfig);

// Initialize chat history with welcome message
const chatHistory = reactive<ChatMessageType[]>([]);

// Function to handle sending a message
const sendMessage = async (message: string) => {
  if (!message.trim()) return;

  // Reset any previous errors and abort controller
  streamError.value = '';
  abortController.value = new AbortController();

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
    content: '',
    timestamp: new Date(),
    isStreaming: true, // Add flag to indicate streaming is in progress
  });

  // Set loading state
  isLoading.value = true;

  try {
    // Use streaming API for all requests
    await sendStreamingRequest(message, responseIndex);
  } catch (error) {
    console.error('Error sending message:', error);

    // Don't show error message if request was intentionally aborted
    if (error instanceof DOMException && error.name === 'AbortError') {
      chatHistory.splice(responseIndex, 1); // Remove the system message placeholder
    } else {
      // Extract a cleaner error message
      const errorMessage =
        error instanceof Error
          ? extractErrorMessage(error.message)
          : 'An error occurred while sending your message';

      streamError.value = errorMessage;

      // Update response with error
      if (chatHistory[responseIndex]) {
        chatHistory[responseIndex].content =
          `I'm sorry, I encountered an error while processing your request: ${errorMessage}`;
        chatHistory[responseIndex].isStreaming = false;
      }
    }
  } finally {
    isLoading.value = false;
    abortController.value = null;
  }
};

// Function to cancel an ongoing message stream
const cancelMessage = () => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
    isLoading.value = false;

    // Find and update any streaming messages
    const streamingMessageIndex = chatHistory.findIndex(msg => msg.isStreaming);
    if (streamingMessageIndex >= 0) {
      chatHistory.splice(streamingMessageIndex, 1);
    }
  }
};

// Send a request using streaming directly to the API
const sendStreamingRequest = async (
  message: string,
  responseIndex: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const { provider, model, systemPrompt, temperature, maxTokens } =
      chatbotConfig.value;

    // Make sure we have a provider and model selected
    if (!provider || !model) {
      reject(
        new Error('Please select a provider and model before sending a message')
      );
      return;
    }

    // Create prompt with system message and user query
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    const chatRequest: ChatRequest = {
      provider,
      model,
      prompt,
      temperature,
      max_tokens: maxTokens,
    };

    const baseUrl = getRequestBaseUrl();
    const url = `${baseUrl}/ai/chat/stream`;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    };

    // Create a fetch request with streaming and abort controller
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(chatRequest),
      signal: abortController.value?.signal,
    })
      .then(response => {
        if (!response.ok) {
          response.text().then(text => {
            const errorMessage = extractErrorMessage(text);
            reject(new Error(errorMessage));
          });
          return;
        }

        // Set up event source for Server-Sent Events
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullResponse = '';

        const processStream = async () => {
          try {
            const { value, done } = await reader.read();

            if (done) {
              // Stream is complete
              if (chatHistory[responseIndex]) {
                chatHistory[responseIndex].isStreaming = false;
              }
              resolve();
              return;
            }

            // Decode the chunk and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process all complete events in the buffer
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const eventData = line.slice(5).trim();
                  if (eventData === '') continue;

                  const chunk = JSON.parse(eventData);

                  // Update the response text with each chunk
                  fullResponse += chunk.text;
                  if (chatHistory[responseIndex]) {
                    // Clean response to avoid duplicate newlines
                    chatHistory[responseIndex].content = fullResponse;
                  }

                  // If we're done, resolve the promise
                  if (chunk.is_done) {
                    if (chatHistory[responseIndex]) {
                      chatHistory[responseIndex].isStreaming = false;
                    }
                    resolve();
                    return;
                  }
                } catch (e) {
                  console.error('Error parsing event data:', e);
                }
              } else if (line.startsWith('event: error')) {
                // Handle error events
                const errorLine = lines.find(l => l.startsWith('data:'));
                if (errorLine) {
                  const errorData = errorLine.slice(5).trim();
                  const errorMessage = extractErrorMessage(errorData);
                  
                  // Log the full error for debugging
                  console.error('Stream error:', errorData);
                  
                  reject(new Error(errorMessage));
                  return;
                }
              }
            }

            // Continue reading
            processStream();
          } catch (error) {
            reject(error);
          }
        };

        processStream();
      })
      .catch(error => {
        reject(error);
      });
  });
};

const selectProviderModel = ({
  provider,
  model,
}: {
  provider: string;
  model: string;
}) => {
  chatbotConfig.value.provider = provider as LLMProviderKey;
  chatbotConfig.value.model = model;

  // Save configuration to localStorage
  localStorage.setItem('chatbotConfig', JSON.stringify(chatbotConfig.value));
};

// Configuration dialog
const configDialogVisible = ref(false);

const openConfig = () => {
  configDialogVisible.value = true;
};

// Empty functions for removed buttons
const openAdd = () => {};
const openHistory = () => {};

defineOptions({ name: 'ClChatSidebar' });
</script>

<template>
  <div
    class="chat-sidebar"
    :class="{ visible: visible, resizing: isResizing }"
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
      <chat-message
        v-for="(message, index) in chatHistory"
        :key="index"
        :message="message"
      />
      <div v-if="streamError" class="stream-error">
        <el-alert type="error" :title="streamError" show-icon />
      </div>
    </div>

    <chat-input
      :is-loading="isLoading"
      :providers="availableProviders"
      :selected-provider="chatbotConfig.provider"
      :selected-model="chatbotConfig.model"
      @send="sendMessage"
      @cancel="cancelMessage"
      @model-change="selectProviderModel"
    />

    <!-- Config Dialog -->
    <chatbot-config-dialog
      :visible="configDialogVisible"
      :providers="availableProviders"
      :current-config="chatbotConfig"
      @close="configDialogVisible = false"
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

.right-content {
  display: flex;
  align-items: center;
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
