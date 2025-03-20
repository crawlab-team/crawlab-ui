<script setup lang="ts">
import { defineProps, ref, nextTick } from 'vue';
import { ElScrollbar } from 'element-plus';
import { debounce } from 'lodash';

const props = defineProps<{
  messages: ChatMessageType[];
  isLoading: boolean;
  error?: string;
}>();

// Reference to the scrollbar component
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null);
const messagesRef = ref<HTMLDivElement | null>(null);

// Track if user is near bottom
const isNearBottom = ref(true);

// Function to check if scroll is near bottom
const checkIfNearBottom = () => {
  if (!scrollbarRef.value?.wrapRef) return true;
  const { scrollTop, scrollHeight, clientHeight } = scrollbarRef.value.wrapRef;
  // Consider "near bottom" if within 20px of bottom
  return scrollHeight - (scrollTop + clientHeight) < 20;
};

// Handle scroll events
const onScroll = () => {
  isNearBottom.value = checkIfNearBottom();
};

// Function to scroll to bottom
const scrollToBottom = debounce(async () => {
  await nextTick();
  // Only scroll if user was already at bottom or it's initial load
  if (isNearBottom.value && messagesRef.value?.clientHeight) {
    scrollbarRef.value?.scrollTo({ top: messagesRef.value?.clientHeight });
  }
});

// Expose scrollToBottom method to parent
defineExpose({
  scrollToBottom,
});

defineOptions({ name: 'ClChatMessageList' });
</script>

<template>
  <div class="chat-message-list">
    <el-scrollbar 
      ref="scrollbarRef" 
      max-height="100%" 
      @scroll="onScroll"
    >
      <div v-if="isLoading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else ref="messagesRef" class="messages">
        <cl-chat-message
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
        />
        <div v-if="error" class="stream-error">
          <el-alert type="error" :title="error" show-icon />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.chat-message-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  padding: 16px;
}

.loading-state {
  padding: 16px;
}

.stream-error {
  margin: 10px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--el-text-color-secondary);
}
</style>
