<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userInput = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Accept loading state from parent
const props = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'send', message: string): void
}>();

const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;
  
  // Reset height to calculate properly
  textareaRef.value.style.height = '0px';
  
  // Set the height based on scrollHeight
  const scrollHeight = textareaRef.value.scrollHeight;
  
  // If scrollHeight exceeds max-height (200px), set to max and show scrollbar
  // Otherwise set to exact scrollHeight for auto-height behavior
  const maxHeight = 200;
  if (scrollHeight > maxHeight) {
    textareaRef.value.style.height = `${maxHeight}px`;
    textareaRef.value.style.overflowY = 'auto';
  } else {
    textareaRef.value.style.height = `${scrollHeight}px`;
    textareaRef.value.style.overflowY = 'hidden';
  }
};

// Watch for changes to userInput and adjust height after Vue updates the DOM
watch(userInput, () => {
  nextTick(adjustTextareaHeight);
});

const sendMessage = () => {
  if (!userInput.value.trim() || props.isLoading) return;
  
  emit('send', userInput.value);
  userInput.value = '';
  
  // Reset textarea height after sending
  nextTick(() => {
    adjustTextareaHeight();
    if (textareaRef.value) {
      textareaRef.value.focus();
    }
  });
};

const handleKeydown = (e: KeyboardEvent) => {
  // Send on Enter without Shift key
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.focus();
    
    // Initial height adjustment
    nextTick(adjustTextareaHeight);
  }
  
  // Add window resize listener to readjust height
  window.addEventListener('resize', adjustTextareaHeight);
});

defineOptions({ name: 'ClChatInput' });
</script>

<template>
  <div class="chat-input">
    <div class="input-container">
      <textarea
        ref="textareaRef"
        v-model="userInput"
        class="message-textarea"
        :placeholder="t('components.ai.chatbot.inputPlaceholder')"
        @input="adjustTextareaHeight"
        @keydown="handleKeydown"
        :disabled="props.isLoading"
        rows="1"
      ></textarea>
      
      <div class="input-actions">
        <el-tooltip :content="t('common.actions.send')" placement="top">
          <el-button 
            type="text"
            class="send-button" 
            :class="{ 'send-button-active': userInput.trim() }" 
            @click="sendMessage" 
            :disabled="!userInput.trim() || props.isLoading"
          >
            <cl-icon :icon="props.isLoading ? ['fas', 'spinner'] : ['fas', 'paper-plane']" :spin="props.isLoading" />
          </el-button>
        </el-tooltip>
      </div>
    </div>
    
    <div class="input-footer">
      <span class="shortcut-hint">{{ t('components.ai.chatbot.enterHint') }}</span>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
  display: flex;
  flex-direction: column;
}

.input-container {
  position: relative;
  display: flex;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.message-textarea {
  flex: 1;
  min-height: 24px;
  max-height: 200px;
  padding: 12px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  color: var(--el-text-color-primary);
  box-sizing: border-box;
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) transparent;
}

/* Webkit scrollbar styling */
.message-textarea::-webkit-scrollbar {
  width: 6px;
}

.message-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.message-textarea::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color-darker);
  border-radius: 6px;
}

.message-textarea::placeholder {
  color: var(--el-text-color-placeholder);
}

.input-actions {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: flex;
  align-items: center;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.send-button-active {
  color: var(--el-color-primary);
}

.send-button:hover:not(:disabled) {
  color: var(--el-color-primary);
  transform: scale(1.05);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.shortcut-hint {
  font-style: italic;
}

.powered-by {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-icon {
  font-size: 10px;
}

@media (max-width: 768px) {
  .shortcut-hint {
    display: none;
  }
}
</style> 