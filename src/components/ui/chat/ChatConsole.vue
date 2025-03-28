<script setup lang="ts">
import { ref, reactive, onBeforeMount, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ChatInput from './ChatInput.vue';
import useRequest from '@/services/request';
import { getRequestBaseUrl } from '@/utils';
import { debounce } from 'lodash';
import { ElMessage } from 'element-plus';
import { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { get } = useRequest();

const router = useRouter();

// Add current conversation ref
const currentConversation = ref<ChatConversation | null>(null);

// Add computed property for current conversation title
const currentConversationTitle = computed(() => {
  if (!currentConversationId.value) return t('components.ai.chatbot.newChat');
  return currentConversation.value?.title || t('components.ai.chatbot.newChat');
});

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

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

// Add conversation management
const conversations = ref<ChatConversation[]>([]);
const currentConversationId = ref<string>('');
const isLoadingConversations = ref(false);
const isLoadingMessages = ref(false);

// History dialog state
const historyDialogVisible = ref(false);

// Add ref for message list component
const messageListRef = ref<{ scrollToBottom: () => Promise<void> } | null>(
  null
);

// Load conversations
const loadConversations = async () => {
  isLoadingConversations.value = true;
  try {
    const res = await get('/ai/chat/conversations', {
      page: 1,
      size: 500,
      sort: JSON.stringify([{ key: 'last_message_at', direction: 'desc' }]),
    });
    conversations.value = res.data || [];
  } catch (error) {
    console.error('Failed to load conversations:', error);
  } finally {
    isLoadingConversations.value = false;
  }
};

// Load messages for a conversation
const loadConversationMessages = debounce(async (conversationId: string) => {
  if (!conversationId) return;

  isLoadingMessages.value = true;
  try {
    const res = await get(`/ai/chat/conversations/${conversationId}/messages`);
    const messages = (res.data || []).map((msg: ChatMessage) => ({
      role: msg.role as ChatMessageRole,
      content: msg.content || '',
      timestamp: new Date(msg.created_ts || Date.now()),
      conversationId: msg.conversation_id,
      isStreaming: false,
    }));

    messages.sort(
      (a: ChatMessageType, b: ChatMessageType) =>
        a.timestamp.getTime() - b.timestamp.getTime()
    );

    chatHistory.splice(0, chatHistory.length, ...messages);
    currentConversationId.value = conversationId;
  } catch (error) {
    console.error('Failed to load conversation messages:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load messages';
  } finally {
    isLoadingMessages.value = false;
    // Scroll to bottom after loading messages
    messageListRef.value?.scrollToBottom();
  }
});

// Select conversation
const selectConversation = async (conversationId: string) => {
  if (currentConversationId.value === conversationId) return;

  currentConversationId.value = conversationId;
  streamError.value = '';
  await loadConversationMessages(conversationId);
  messageListRef.value?.scrollToBottom();
};

// Create new conversation
const createNewConversation = () => {
  currentConversationId.value = '';
  localStorage.removeItem('currentConversationId');
  streamError.value = '';
  chatHistory.splice(0, chatHistory.length);
  focusChatInput();
};

// Load current conversation details
const loadCurrentConversation = debounce(async (conversationId: string) => {
  if (!conversationId) {
    currentConversation.value = null;
    return;
  }
  try {
    const res = await get(`/ai/chat/conversations/${conversationId}`);
    currentConversation.value = res.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 404) {
      currentConversationId.value = '';
      return;
    }
    console.error('Failed to load conversation details:', error);
    currentConversation.value = null;
  }
});

// Watch for conversation ID changes to load details
watch(currentConversationId, async newId => {
  // Save current conversation ID to localStorage
  if (newId) {
    localStorage.setItem('currentConversationId', newId);
    await loadCurrentConversation(newId);
  } else {
    localStorage.removeItem('currentConversationId');
    currentConversation.value = null;
  }

  // Update selected conversation ID if needed
  if (newId && !currentConversationId.value) {
    await loadConversations();
    currentConversationId.value = newId;
  }
});

// Initialize
onBeforeMount(async () => {
  await loadConversations();
  loadChatbotConfig();
  await loadLLMProviders();

  // Load saved conversation ID from localStorage
  const savedConversationId = localStorage.getItem('currentConversationId');
  if (savedConversationId) {
    await loadConversationMessages(savedConversationId);
    await loadCurrentConversation(savedConversationId);
    currentConversationId.value = savedConversationId;
  }
});

// Add AbortController for cancelling requests
const abortController = ref<AbortController | null>(null);

// Error message extraction
const extractErrorMessage = (errorData: string): string => {
  try {
    // Try to parse the error data as JSON
    const parsed = JSON.parse(errorData);
    if (parsed.error_detail?.message) return parsed.error_detail.message;
    if (parsed.error)
      return typeof parsed.error === 'string'
        ? parsed.error
        : JSON.stringify(parsed.error);
    if (parsed.text?.startsWith('Error:')) return parsed.text;
    if (typeof parsed === 'object') return JSON.stringify(parsed, null, 2);
    return errorData;
  } catch (e) {
    return errorData;
  }
};

// API calls
const loadLLMProviders = debounce(async () => {
  try {
    const res = await get('/ai/llm/providers', { available: true });
    availableProviders.value = res.data || [];

    if (!availableProviders.value.length) {
      // Reset provider and model if no providers are available
      resetChatbotConfig();
    }

    if (!chatbotConfig.value.provider || !chatbotConfig.value.model) {
      if (availableProviders.value.length > 0) {
        chatbotConfig.value.provider = availableProviders.value[0].key!;
        chatbotConfig.value.model = availableProviders.value[0].models![0];
        localStorage.setItem(
          'chatbotConfig',
          JSON.stringify(chatbotConfig.value)
        );
      }
    }
  } catch (error) {
    console.error('Failed to load LLM providers:', error);
  }
});

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

// Save configuration to localStorage
const saveChatbotConfig = (config: ChatbotConfig) => {
  configDialogVisible.value = false;
  chatbotConfig.value = { ...chatbotConfig.value, ...config };
  localStorage.setItem('chatbotConfig', JSON.stringify(chatbotConfig.value));
  ElMessage.success(t('common.message.success.save'));
};

// Reset chatbot configuration
const resetChatbotConfig = () => {
  chatbotConfig.value = {};
  localStorage.removeItem('chatbotConfig');
};

// Initialize chat history
const chatHistory = reactive<ChatMessageType[]>([]);

// Message handling
const sendMessage = async (message: string) => {
  if (!message.trim()) return;

  streamError.value = '';
  abortController.value = new AbortController();

  chatHistory.push({
    role: 'user',
    content: message,
    timestamp: new Date(),
  });
  // Scroll to bottom after adding user message
  messageListRef.value?.scrollToBottom();

  const responseIndex = chatHistory.length;
  chatHistory.push({
    role: 'system',
    content: '',
    timestamp: new Date(),
    isStreaming: true,
  });
  // Scroll to bottom after adding system message placeholder
  messageListRef.value?.scrollToBottom();

  isLoading.value = true;

  try {
    await sendStreamingRequest(message, responseIndex);
  } catch (error) {
    console.error('Error sending message:', error);

    if (error instanceof DOMException && error.name === 'AbortError') {
      chatHistory.splice(responseIndex, 1);
    } else {
      const errorMessage =
        error instanceof Error
          ? extractErrorMessage(error.message)
          : 'An error occurred while sending your message';

      streamError.value = errorMessage;

      if (chatHistory[responseIndex]) {
        chatHistory[responseIndex].content =
          `I'm sorry, I encountered an error while processing your request: ${errorMessage}`;
        chatHistory[responseIndex].isStreaming = false;
        // Scroll to bottom after error message
        messageListRef.value?.scrollToBottom();
      }
    }
  } finally {
    isLoading.value = false;
    focusChatInput();
    abortController.value = null;
  }
};

const cancelMessage = () => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
    isLoading.value = false;

    const streamingMessageIndex = chatHistory.findIndex(msg => msg.isStreaming);
    if (streamingMessageIndex >= 0) {
      chatHistory.splice(streamingMessageIndex, 1);
    }
  }
};

const sendStreamingRequest = async (
  message: string,
  responseIndex: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const { provider, model, systemPrompt, temperature, maxTokens } =
      chatbotConfig.value;

    if (!provider || !model) {
      reject(
        new Error('Please select a provider and model before sending a message')
      );
      return;
    }

    const chatRequest: ChatRequest = {
      provider,
      model,
      query: message,
      system_prompt: systemPrompt,
      temperature,
      max_tokens: maxTokens,
      conversation_id: currentConversationId.value,
    };

    const baseUrl = getRequestBaseUrl();
    const url = `${baseUrl}/ai/chat/stream`;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    };

    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(chatRequest),
      signal: abortController.value?.signal,
    })
      .then(response => {
        if (!response.ok) {
          response.text().then(text => {
            reject(new Error(extractErrorMessage(text)));
          });
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullResponse = '';

        const processStream = async () => {
          try {
            const { value, done } = await reader.read();

            if (done) {
              if (chatHistory[responseIndex]) {
                chatHistory[responseIndex].isStreaming = false;
                // Scroll to bottom when streaming is complete
                messageListRef.value?.scrollToBottom();
              }
              resolve();
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const eventData = line.slice(5).trim();
                  if (eventData === '') continue;

                  const chunk: ChatbotStreamMessage = JSON.parse(eventData);

                  if (chunk.is_initial) {
                    currentConversationId.value = chunk.conversation_id!;
                    continue;
                  }

                  if (chunk.conversation_title) {
                    if (!currentConversation.value) {
                      currentConversation.value = {
                        title: chunk.conversation_title,
                      };
                    } else {
                      currentConversation.value.title =
                        chunk.conversation_title;
                    }
                  }

                  fullResponse += chunk.content || '';
                  if (chatHistory[responseIndex]) {
                    chatHistory[responseIndex].content = fullResponse;
                    chatHistory[responseIndex].conversationId =
                      chunk.conversation_id;
                    // Scroll to bottom during streaming
                    messageListRef.value?.scrollToBottom();
                  }

                  if (chunk.is_done) {
                    if (chatHistory[responseIndex]) {
                      chatHistory[responseIndex].isStreaming = false;
                      // Scroll to bottom when streaming is complete
                      messageListRef.value?.scrollToBottom();
                    }
                    resolve();
                    return;
                  }
                } catch (e) {
                  console.error('Error parsing event data:', e);
                }
              } else if (line.startsWith('event: error')) {
                const errorLine = lines.find(l => l.startsWith('data:'));
                if (errorLine) {
                  const errorData = errorLine.slice(5).trim();
                  const errorMessage = extractErrorMessage(errorData);
                  console.error('Stream error:', errorData);
                  reject(new Error(errorMessage));
                  return;
                }
              }
            }

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
  localStorage.setItem('chatbotConfig', JSON.stringify(chatbotConfig.value));
};

const addProviderModel = () => {
  router.push('/system/ai');
};

// Configuration dialog
const configDialogVisible = ref(false);

const openConfig = () => {
  configDialogVisible.value = true;
};

const openHistory = debounce(() => {
  historyDialogVisible.value = true;
  loadConversations();
});

const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null);

const focusChatInput = debounce(() => {
  chatInputRef.value?.focus();
});

defineOptions({ name: 'ClChatConsole' });
</script>

<template>
  <div class="chat-console">
    <div class="console-header">
      <span v-if="visible" class="chat-toggle-btn" @click="emit('close')">
        <cl-icon :icon="['fa', 'angles-right']" class="toggle-indicator" />
      </span>
      <div class="chat-conversation-title" :title="currentConversationTitle">
        {{ currentConversationTitle }}
      </div>
      <el-tooltip :content="t('components.ai.chatbot.new')">
        <el-button type="text" @click="createNewConversation" class="new-btn">
          <cl-icon :icon="['fas', 'plus']" />
        </el-button>
      </el-tooltip>
      <el-popover
        v-model:visible="historyDialogVisible"
        trigger="click"
        :show-arrow="false"
        placement="bottom-end"
        width="320"
      >
        <template #reference>
          <div class="history-btn-wrapper">
            <el-tooltip :content="t('components.ai.chatbot.history')">
              <el-button
                type="text"
                @click.prevent="openHistory"
                class="history-btn"
              >
                <cl-icon :icon="['fas', 'history']" />
              </el-button>
            </el-tooltip>
          </div>
        </template>
        <cl-chat-history
          :conversations="conversations"
          :selected-conversation-id="currentConversationId"
          :is-loading="isLoadingConversations"
          @select="selectConversation"
          @close="historyDialogVisible = false"
        />
      </el-popover>
      <el-tooltip :content="t('components.ai.chatbot.config.title')">
        <el-button type="text" @click="openConfig" class="config-btn">
          <cl-icon :icon="['fas', 'cog']" />
        </el-button>
      </el-tooltip>
    </div>

    <div class="chat-container">
      <div class="chat-content">
        <cl-chat-message-list
          :messages="chatHistory"
          :is-loading="isLoadingMessages"
          :error="streamError"
          ref="messageListRef"
        />

        <cl-chat-input
          ref="chatInputRef"
          :is-loading="isLoading"
          :providers="availableProviders"
          :selected-provider="chatbotConfig.provider"
          :selected-model="chatbotConfig.model"
          @send="sendMessage"
          @cancel="cancelMessage"
          @model-change="selectProviderModel"
          @add-model="addProviderModel"
        />
      </div>
    </div>

    <cl-chat-config-dialog
      :visible="configDialogVisible"
      :providers="availableProviders"
      :current-config="chatbotConfig"
      @close="configDialogVisible = false"
      @confirm="saveChatbotConfig"
    />
  </div>
</template>

<style scoped>
.chat-console {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--el-bg-color);
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-color-white);
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-toggle-btn {
  display: flex;
  align-items: center;
  padding: 8px;
  animation: fadeIn 0.3s ease-in-out;
  color: var(--el-color-primary-dark-2);
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;

  &:hover {
    color: white;
    background-color: var(--el-color-primary-dark-2);
  }
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

.chat-conversation-title {
  font-size: 14px;
  color: var(--el-text-color-regular);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
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
