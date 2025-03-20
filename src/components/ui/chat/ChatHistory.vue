<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  conversations: ChatConversation[];
  selectedConversationId: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', conversationId: string): void;
  (e: 'close'): void;
}>();

// Search functionality
const searchQuery = ref('');

// Computed property for filtered conversations
const filteredConversations = computed(() => {
  if (!searchQuery.value) return props.conversations;
  const query = searchQuery.value.toLowerCase();
  return props.conversations.filter(conv => {
    const title = getConversationTitle(conv).toLowerCase();
    const model = (conv.model || '').toLowerCase();
    return title.includes(query) || model.includes(query);
  });
});

// Format conversation title
const getConversationTitle = (conversation: ChatConversation) => {
  if (conversation.title) return conversation.title;
  return t('components.ai.chatbot.newChat');
};

// Handle conversation selection
const handleSelect = (conversationId: string) => {
  emit('select', conversationId);
  emit('close');
};

defineOptions({ name: 'ClChatHistory' });
</script>

<template>
  <div class="chat-history">
    <div class="chat-history-header">
      <el-input
        v-model="searchQuery"
        :placeholder="t('components.ai.chatbot.searchHistory')"
        clearable
      >
        <template #prefix>
          <cl-icon :icon="['fas', 'search']" />
        </template>
      </el-input>
    </div>
    <div v-if="isLoading" class="chat-history-loading">
      <el-skeleton :rows="3" animated />
    </div>
    <div
      v-else-if="filteredConversations.length === 0"
      class="chat-history-empty"
    >
      <el-empty
        :description="t('components.ai.chatbot.noConversations')"
        :image-size="60"
      />
    </div>
    <div v-else class="chat-history-list">
      <el-scrollbar max-height="400px">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation._id"
          class="chat-history-item"
          :class="{
            active: selectedConversationId === conversation._id,
          }"
          @click="handleSelect(conversation._id!)"
        >
          <div class="chat-history-item-title">
            {{ getConversationTitle(conversation) }}
          </div>
          <div class="chat-history-item-meta">
            <span class="chat-history-item-date">
              <cl-time
                :time="conversation.last_message_at || conversation.created_ts"
                ago
                :ago-format-style="{ flavour: 'narrow' }"
              />
            </span>
            <span class="chat-history-item-model">
              {{ conversation.model }}
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.chat-history {
  margin: -12px;
}

.chat-history-header {
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 6px 8px;

  &:deep(.el-input) {
    margin: 0;
    padding: 0;
  }

  &:deep(.el-input__wrapper) {
    border: none;
    box-shadow: none;
    padding: 0;
  }
}

.chat-history-loading,
.chat-history-empty {
  padding: 12px;
}

.chat-history-list {
  max-height: 400px;
  overflow: hidden;
}

.chat-history-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s ease;
}

.chat-history-item:hover {
  background-color: var(--el-fill-color-light);
}

.chat-history-item.active {
  background-color: var(--el-color-primary-light-9);
}

.chat-history-item-title {
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-history-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.chat-history-item-date {
  flex-shrink: 0;
}

.chat-history-item-model {
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 