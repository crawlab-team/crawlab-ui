<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userInput = ref('');

const emit = defineEmits<{
  (e: 'send', message: string): void
}>();

const sendMessage = () => {
  if (!userInput.value.trim()) return;
  emit('send', userInput.value);
  userInput.value = '';
};

defineOptions({ name: 'ClChatInput' });
</script>

<template>
  <div class="chat-input">
    <el-input
      v-model="userInput"
      :placeholder="t('components.ai.chatbot.inputPlaceholder')"
      @keyup.enter="sendMessage"
    >
      <template #append>
        <el-button @click="sendMessage">
          <cl-icon :icon="['fa', 'paper-plane']" />
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.chat-input {
  padding: 16px;
  border-top: 1px solid var(--el-border-color-light);
}
</style> 