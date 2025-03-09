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
  <div :class="['message', message.role]">
    <div class="message-content">{{ message.content }}</div>
    <div class="message-time">{{ formatTime(message.timestamp) }}</div>
  </div>
</template>

<style scoped>
.message {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 8px;
  position: relative;
}

.message.user {
  align-self: flex-end;
  background-color: var(--cl-primary-color-light);
  color: var(--el-text-color-primary);
}

.message.system {
  align-self: flex-start;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

.message-content {
  word-break: break-word;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}
</style> 