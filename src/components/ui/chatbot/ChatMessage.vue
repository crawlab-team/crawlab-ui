<script setup lang="ts">
defineProps<{
  message: {
    role: 'user' | 'system',
    content: string,
    timestamp: Date
  }
}>();

// Format timestamp
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

defineOptions({ name: 'ClChatMessage' });
</script>

<template>
  <div :class="['message-container', message.role]">
    <div class="message-content">{{ message.content }}</div>
    <div class="message-time">{{ formatTime(message.timestamp) }}</div>
  </div>
</template>

<style scoped>
.message-container {
  font-size: 14px;
  width: calc(100% - 24px);
  margin: 0 12px;
  padding: 12px;
  position: relative;
}

.message-container.user {
  border-radius: 12px;
  background-color: var(--el-color-primary-dark-2);
}

.message-container.system {
  background-color: transparent;
}

.message-content {
  word-break: break-word;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 6px;
}

.message-container.user .message-content {
  color: var(--el-color-white);
}

.message-container.user .message-time {
  color: var(--el-color-white);
}

.message-container.system .message-content {
  color: var(--el-text-color-regular);
}

.message-container.system .message-time {
  color: var(--el-text-color-regular);
}
</style> 